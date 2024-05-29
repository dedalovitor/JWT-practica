from flask_sqlalchemy import SQLAlchemy
from flask import current_app
from sqlalchemy import text
import base64
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    pets = db.relationship("Pet", backref="user")

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Cambiar para almacenar solo la ruta de la imagen en lugar de la imagen en sí
    image_pet_url = db.Column(db.String(255), nullable=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    race = db.Column(db.String(120), unique=False, nullable=False)
    age = db.Column(db.Integer, unique=False, nullable=False)
    castrated = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=True, default=True)
    order_number = db.Column(db.Integer, nullable=False)  # Nueva columna para almacenar el número de orden
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    images = db.relationship('PetImage', backref='pet', lazy=True)

    def serialize(self):
        # Convierte la imagen binaria a base64 si existe, de lo contrario, establece None
        #image_pet_base64 = base64.b64encode(self.image_pet).decode() if self.image_pet else None
        images_serialized = [image.serialize() for image in self.images]
        return {
            "id": self.id,
            "image_pet_url": self.image_pet_url,            
            "name": self.name,
            "age": self.age,
            "race": self.race,
            "castrated": self.castrated,
            "images": images_serialized, # Serializa las imágenes asociadas
            "order_number": self.order_number, 
            
            # do not serialize the password, its a security breach
        }


class PetImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable= False)
    url = db.Column(db.String(255))

    def serialize(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "url": self.url
        }


# Verificamos si estamos en el contexto de la aplicación Flask antes de ejecutar el código de alteración de la tabla. Verifica si el script se está ejecutando directamente y no como módulo importado
if __name__ == '__main__':
    # Entramos en el contexto de la aplicación Flask
    with current_app.app_context():
        try:
            # Intenta alterar la tabla pet en la base de datos, cambiando el tipo de la columna image_pet a BYTEA
            db.session.execute(text("ALTER TABLE pet ALTER COLUMN image_pet TYPE BYTEA USING image_pet::bytea"))
            # Confirma la transacción
            db.session.commit()
        except Exception as e:
            # Si ocurre algún error, imprímelo para depuración
            print(e)
            # Realiza un rollback de la transacción
            db.session.rollback()