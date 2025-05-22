from django.http import JsonResponse

from users.models import Token


def token_required(view_func):
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Missing or invalid token'}, status=401)

        try:
            token_key = auth_header.split(' ')[1]
        except IndexError:
            return JsonResponse({'error': 'Invalid token format'}, status=400)

        try:
            token = Token.objects.get(key=token_key)
            request.user = token.user
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        except Exception as e:
            return JsonResponse({'error': f'Error validating token: {str(e)}'}, status=500)

        return view_func(request, *args, **kwargs)

    return wrapper
