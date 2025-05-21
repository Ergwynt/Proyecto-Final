from shared.Serializer import BaseSerializer


class UserSerializer(BaseSerializer):
    def __init__(self, to_serialize, *, fields=[], request=None):
        super().__init__(to_serialize, fields=fields, request=request)

    def serialize_instance(self, instance) -> dict:
        profile = getattr(instance, 'profile', None)
        return {
            'id': instance.pk,
            'username': instance.username,
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'email': instance.email,
            'bio': profile.bio if profile else None,
            'is_admin': instance.is_superuser,
            'profile_picture': profile.profile_picture.url
            if profile and profile.profile_picture
            else None,
        }


class ProfileSerializer(BaseSerializer):
    def __init__(self, to_serialize, *, fields=[], request=None):
        super().__init__(to_serialize, fields=fields, request=request)

    def serialize_instance(self, instance) -> dict:
        return {
            'bio': instance.bio,
            'profile_picture': instance.profile_picture.url if instance.profile_picture else None,
        }


class TokenSerializer(BaseSerializer):
    def __init__(self, to_serialize, *, fields=[], request=None):
        super().__init__(to_serialize, fields=fields, request=request)

    def serialize_instance(self, instance) -> dict:
        user_data = UserSerializer(instance.user).serialize_instance(instance.user)
        return {
            'user': user_data,
            'key': str(instance.key),
            'created_at': instance.created_at,
        }
