from books.BookSerializer import BookSerializer
from shared.Serializer import BaseSerializer
from users.UserSerializer import UserSerializer


class RentalSerializer(BaseSerializer):
    def __init__(self, to_serialize, *, fields=[], request=None):
        super().__init__(to_serialize, fields=fields, request=request)

    def serialize_instance(self, instance) -> dict:
        return {
            'rental_id': instance.pk,
            'user': UserSerializer(instance.user, request=self.request).serialize(),
            'book': BookSerializer(instance.book, request=self.request).serialize(),
            'rental_start_date': instance.rental_start_date,
            'rental_end_date': instance.rental_end_date,
            'is_active': instance.is_active,
        }
