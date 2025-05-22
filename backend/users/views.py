import json
import uuid

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt

from shared.decorators import post_required
from users.models import Token

from .decorators import token_required
from .models import Profile
from .UserSerializer import ProfileSerializer, UserSerializer


# Funcion para obtener los datos de un perfil
@csrf_exempt
@token_required
def get_profile(request):
    if request.method == 'GET':
        user = request.user
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            return JsonResponse({'error': 'Perfil no encontrado'}, status=404)

        serialized_user = UserSerializer(user).serialize_instance(user)
        serialized_profile = ProfileSerializer(profile).serialize_instance(profile)

        return JsonResponse(
            {
                'user': serialized_user,
                'profile': serialized_profile,
            },
            status=200,
        )

    return JsonResponse({'error': 'Invalid method'}, status=405)


# Funcion para modificar el perfil de un usuario
@csrf_exempt
@token_required
def update_profile(request):
    if request.method == 'POST':
        user = request.user
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            return JsonResponse({'error': 'Perfil no encontrado'}, status=404)

        bio = request.POST.get('bio')
        profile_picture = request.FILES.get('profile_picture')

        if bio is not None:
            profile.bio = bio

        if profile_picture is not None:
            if profile.profile_picture and 'default.jpg' not in profile.profile_picture.name:
                profile.profile_picture.delete(save=False)
            profile.profile_picture = profile_picture

        profile.save()

        serialized_profile = ProfileSerializer(profile).serialize_instance(profile)
        serialized_user = UserSerializer(user).serialize_instance(user)

        return JsonResponse(
            {
                'profile': serialized_profile,
                'user': serialized_user,
                'message': 'Perfil actualizado correctamente',
            },
            status=200,
        )

    return JsonResponse({'error': 'Método no permitido'}, status=405)


# Funcion para iniciar sesion de un usuario
@csrf_exempt
@post_required
def login(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)
            username = payload.get('username')
            password = payload.get('password')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON body'}, status=400)

        if not username or not password:
            return JsonResponse({'error': 'Faltan campos obligatorios'}, status=400)

        user = authenticate(username=username, password=password)
        if user is None:
            return JsonResponse({'error': 'Crdenciales no validas'}, status=401)

        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user, key=uuid.uuid4(), created_at=now())

        user_profile = 'admin' if user.is_superuser else 'normal'

        return JsonResponse(
            {
                'token': str(token.key),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'is_superuser': user.is_superuser,
                    'profile': user_profile,
                },
            }
        )

    return JsonResponse({'error': 'Invalid method'}, status=405)


# Funcion oara registrar un usuario
@csrf_exempt
@post_required
def register(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)

            username = payload.get('username')
            password = payload.get('password')
            first_name = payload.get('first_name')
            last_name = payload.get('last_name')
            email = payload.get('email')

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON body'}, status=400)

        if not username or not password or not first_name or not last_name or not email:
            return JsonResponse({'error': 'Faltan campos obligatorios'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username ya existente'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email ya existente'}, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email,
        )

        profile = Profile.objects.create(user=user)

        token = Token.objects.create(user=user)

        return JsonResponse(
            {
                'message': 'Usuario creado con exito',
                'token': str(token.key),
                'user': {
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                },
            },
            status=201,
        )

    return JsonResponse({'error': 'Invalid method'}, status=405)


# Funcion para cerrar sesion
@csrf_exempt
@token_required
def logout(request):
    try:
        request.user.token.delete()
        return JsonResponse({'message': 'Logged out successfully '}, status=200)
    except Token.DoesNotExist:
        return JsonResponse({'error': 'Token not found'}, status=400)


# Funion para autenticar un usuario
@csrf_exempt
def auth(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON body'}, status=400)

        if 'username' not in payload or 'password' not in payload:
            return JsonResponse({'error': 'Faltan campos obligatorios'}, status=400)

        user = authenticate(username=payload['username'], password=payload['password'])

        if user is not None:
            if not hasattr(user, 'token'):
                return JsonResponse({'error': 'El usuario no tiene token'}, status=401)

            user_profile = 'admin' if user.is_superuser else 'normal'
            return JsonResponse(
                {
                    'token': user.token.key,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'is_superuser': user.is_superuser,
                        'profile': user_profile,
                    },
                }
            )

        return JsonResponse({'error': 'Invalid credentials'}, status=401)

    elif request.method == 'GET':
        auth_header = request.headers.get('Authorization', '').split()
        if len(auth_header) != 2 or auth_header[0].lower() != 'token':
            return JsonResponse({'error': 'Invalid authorization header'}, status=401)

        try:
            token = auth_header[1]
            user_token = Token.objects.select_related('user').get(key=token)
            user = user_token.user
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        return JsonResponse(
            {
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'is_superuser': user.is_superuser,
                    'profile': 'admin' if user.is_superuser else 'normal',
                }
            }
        )

    return JsonResponse({'error': 'Method not allowed'}, status=405)
