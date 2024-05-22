from flask_sqlalchemy import SQLAlchemy
from flask import current_app
from sqlalchemy import text
import base64
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
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
    image_pet = db.Column(db.LargeBinary, nullable=True)  # Cambio el tipo de campo a LargeBinary no a cadena de string
    name = db.Column(db.String(120), unique=False, nullable=False)
    race = db.Column(db.String(120), unique=False, nullable=False)
    age = db.Column(db.Integer, unique=False, nullable=False)
    castrated = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=True, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        image_pet_base64 = base64.b64encode(self.image_pet).decode() if self.image_pet else None
        return {
            "id": self.id,
            "image_pet": image_pet_base64,            
            "name": self.name,
            "age": self.age,
            "race": self.race,
            "castrated": self.castrated,
            
            # do not serialize the password, its a security breach
        }

# Verificamos si estamos en el contexto de la aplicación Flask antes de ejecutar el código de alteración de la tabla
if __name__ == '__main__':
    with current_app.app_context():
        try:
            # Realizar la alteración de la tabla
            db.session.execute(text("ALTER TABLE pet ALTER COLUMN image_pet TYPE BYTEA USING image_pet::bytea"))
            db.session.commit()
        except Exception as e:
            # Si hay algún error, imprimirlo para depuración
            print(e)
            db.session.rollback()