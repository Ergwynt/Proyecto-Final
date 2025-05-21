from shared.Serializer import BaseSerializer


class BookSerializer(BaseSerializer):
    def serialize_instance(self, instance) -> dict:
        cover_url = instance.cover.url if instance.cover else None
        return {
            'id': instance.pk,
            'isbn': instance.isbn,
            'title': instance.title,
            'slug': instance.slug,
            'author': instance.author,
            'description': instance.description,
            'cover': self.build_url(cover_url) if cover_url else None,
            'available': instance.available,
            'category': {'value': instance.category, 'label': instance.get_category_display()},
        }
