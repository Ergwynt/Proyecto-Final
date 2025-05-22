from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from shared.decorators import get_required, post_required
from users.decorators import token_required

from .BookSerializer import BookSerializer
from .models import Book


# Funcion para listar todos los libros
@csrf_exempt
@get_required
@token_required
def book_list(request):
    books = Book.objects.all()

    title_query = request.GET.get('title', '')
    author_query = request.GET.get('author', '')
    category_query = request.GET.get('category', '')

    if title_query:
        books = books.filter(title__icontains=title_query)
    if author_query:
        books = books.filter(author__icontains=author_query)

    if category_query:
        books = books.filter(category=category_query)

    serializer = BookSerializer(books, request=request)

    return serializer.json_response()


# Funcion para mostrar el detalle de un libro
@csrf_exempt
@get_required
@token_required
def book_detail(request, isbn):
    try:
        book = Book.objects.get(isbn=isbn)
    except Book.DoesNotExist:
        return JsonResponse({'error': 'Libro no encotrado'}, status=404)

    serializer = BookSerializer(book, request=request)
    return serializer.json_response()


# Funcion para añadir un libro
@csrf_exempt
@post_required
@token_required
def create_book(request):
    if request.user.is_superuser:
        try:
            data = request.POST
            files = request.FILES

            required_fields = ['isbn', 'title', 'author', 'description']
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({'error': f'Falta el campo: {field}'}, status=400)

            if Book.objects.filter(isbn=data.get('isbn')).exists():
                return JsonResponse({'error': 'Ya existe un libro con este ISBN'}, status=400)

            book_data = {
                'isbn': data.get('isbn'),
                'title': data.get('title'),
                'author': data.get('author'),
                'description': data.get('description'),
                'category': data.get('category'),
                'available': data.get('available', 'true').lower() == 'true',
            }

            if 'cover' in files:
                if not files['cover'].content_type.startswith('image/'):
                    return JsonResponse({'error': 'El archivo debe ser una imagen'}, status=400)
                book_data['cover'] = files['cover']

            book = Book.objects.create(**book_data)
            serializer = BookSerializer(book)
            book_data = serializer.serialize_instance(book)
            return JsonResponse(
                {'message': 'Libro actualizado correctamente', 'book': book_data}, status=200
            )
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'El usuario no tiene permisos'}, status=403)


@csrf_exempt
@post_required
@token_required
def update_book(request, isbn):
    if request.user.is_superuser:
        try:
            try:
                book = Book.objects.get(isbn=isbn)
            except Book.DoesNotExist:
                return JsonResponse({'error': 'Libro no encontrado'}, status=404)

            data = request.POST
            files = request.FILES

            if 'title' in data:
                book.title = data['title']
            if 'author' in data:
                book.author = data['author']
            if 'description' in data:
                book.description = data['description']
            if 'category' in data:
                book.category = data['category']
            if 'available' in data:
                book.available = data['available'].lower() == 'true'

            if 'cover' in files:
                cover = files['cover']
                if not cover.content_type.startswith('image/'):
                    return JsonResponse({'error': 'El archivo debe ser una imagen'}, status=400)
                book.cover = cover
            book.save()
            serializer = BookSerializer(book, request=request)
            book_data = serializer.serialize_instance(book)
            return JsonResponse(
                {'message': 'Libro actualizado correctamente', 'book': book_data}, status=200
            )

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'El usuario no tiene permisos para esto'}, status=403)
