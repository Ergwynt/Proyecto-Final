import json
from datetime import datetime

from django.http import JsonResponse
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt

from books.models import Book
from shared.decorators import get_required, post_required
from users.decorators import token_required

from .models import Rental
from .RentalSerializer import RentalSerializer


# Funcion para obtener la renta de los libros de un usuario
@csrf_exempt
@get_required
@token_required
def rent_list_user(request):
    try:
        if request.user.is_superuser:
            rentals = Rental.objects.all()
        else:
            rentals = Rental.objects.filter(user=request.user, is_active=True)

        serializer = RentalSerializer(rentals, request=request)
        return serializer.json_response()

    except Exception:
        return JsonResponse({'error': 'Error al obtener los alquileres'}, status=500)


# Función para leer el libro rentado
@csrf_exempt
@get_required
@token_required
def view_rent(isbn, request):
    pass


# Funcion para rentar un libro
@csrf_exempt
@post_required
@token_required
def rent_book(request):
    if not request.user.is_superuser:
        if request.method == 'POST':
            try:
                payload = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON body'}, status=400)

            if 'isbn' not in payload or 'rental_end_date' not in payload:
                return JsonResponse({'error': 'Faltan campos obligatorios'}, status=400)

            try:
                book = Book.objects.get(isbn=payload['isbn'])
            except Book.DoesNotExist:
                return JsonResponse({'error': 'Libro no encontrado'}, status=404)

            if not book.available:
                return JsonResponse({'error': 'Libro no disponible'}, status=400)

            datenow = datetime.now()
            print(datenow)

            rental_end_date = parse_datetime(payload['rental_end_date'])
            print(rental_end_date)
            if rental_end_date is None:
                return JsonResponse({'error': 'Invalid rental_end_date format'}, status=400)
            if rental_end_date < datenow:
                return JsonResponse({'error': 'date no puede ser menor a dia actual.'}, status=400)

            book.available = False
            book.save()

            rental = Rental.objects.create(
                user=request.user,
                book=book,
                rental_end_date=rental_end_date,
                is_active=True,
            )

            return JsonResponse(
                {
                    'rental': rental.user.username,
                    'book title': rental.book.title,
                    'end date': rental.rental_end_date,
                },
                status=200,
            )

        return JsonResponse({'error': 'Invalid method'}, status=405)
    else:
        return JsonResponse({'error': ''}, status=403)


# Funcion para devolver un libro rentado
@csrf_exempt
@post_required
@token_required
def return_book(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)
            print('Payload recibido:', payload)
            print('Usuario autenticado:', request.user)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON body'}, status=400)

        if 'rental_id' not in payload:
            return JsonResponse({'error': 'Falta rental_id'}, status=400)

        try:
            rental = Rental.objects.get(id=payload['rental_id'], user=request.user, is_active=True)
            print('Alquiler encontrado:', rental)
        except Rental.DoesNotExist:
            return JsonResponse({'error': 'Rental no encotrada o ya ha sido devuelta'}, status=404)

        rental.is_active = False
        rental.return_date = timezone.now()
        rental.save()
        print('Alquiler actualizado:', rental)

        rental.book.available = True
        rental.book.save()
        print('Libro actualizado, disponible:', rental.book.available)

        return JsonResponse({'message': 'Libro devuelto con exito!'})

    return JsonResponse({'error': 'Invalid method'}, status=405)
