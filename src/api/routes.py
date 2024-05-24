"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import current_app, send_from_directory  # Importa send_from_directory
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Pet
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import datetime
from werkzeug.utils import secure_filename
import os  # <--- Agregar esta línea para importar el módulo os
from PIL import Image
from io import BytesIO



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/login', methods=['POST'])
def user_login():
    body_email = request.json.get("email")
    body_password = request.json.get("password")
    user = User.query.filter_by(email = body_email, password = body_password).first()

    if not user:
        return jsonify({"error": "error en credenciales"}), 401
    expires = datetime.timedelta(hours=8)
    token = create_access_token(identity= user.id, expires_delta=expires)
    
 
    return jsonify({"response": "Hola", "token": token}), 200


@api.route('/user', methods=['GET'])
@jwt_required()
def current_user_email():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
 
    return jsonify({"response": "Hola", "email": user.email}), 200


@api.route('/register', methods=['POST'])
def user_register():
    body_name = request.json.get("name")
    body_email = request.json.get("email")
    body_password = request.json.get("password")
    user_already_exist = User.query.filter_by(email = body_email).first()
    if user_already_exist:
        return jsonify({"response": "email already exist"}), 300
    new_user = User(name= body_name, email=body_email, password=body_password)
    db.session.add(new_user)
    db.session.commit()
 
    return jsonify({"response": "User registered successfully"}), 200


@api.route('/pet', methods=['POST'])
@jwt_required()
def create_pet():
    user_id = get_jwt_identity()
    body_name = request.form.get("name")
    body_age = request.form.get("age")
    body_race = request.form.get("race")
    body_castrated = request.form.get("castrated") == 'true'  # Convert to boolean
    if 'image_pet' in request.files:
    # Guardar la imagen en el sistema de archivos
        image_file = request.files['image_pet']
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        image_file.save(image_path)
    # Construye la URL de la imagen en el servidor de Gitpod
        image_url = f"https://5500-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/uploads/{filename}"
    else:
        image_url = None  # Si no se proporciona imagen, establecerla como None

    new_pet = Pet(name=body_name, age=int(body_age), race=body_race, castrated=body_castrated, user_id=user_id, image_pet_url=image_url)
    db.session.add(new_pet)
    db.session.commit()

    return jsonify({"response": "Pet registered successfully"}), 200


@api.route('/pets', methods=['GET'])
@jwt_required()
def get_all_current_user_pets():
    user_id = get_jwt_identity()
    pets = Pet.query.filter_by(user_id=user_id, is_active = True).order_by(Pet.id).all()
    pets_serialized = [pet.serialize() for pet in pets]
    return jsonify({"results": pets_serialized}), 200



@api.route('/pet/<int:pet_id>', methods=['GET'])
def get_pet_by_id(pet_id):
    pet = Pet.query.filter_by(id=pet_id).first()
    return jsonify({"result": pet.serialize()}), 200


@api.route('/pet/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.get(pet_id)
    if pet.user_id == user_id:
        pet.is_active = False
        db.session.commit()
        return jsonify({ "response": "Pet deleted correctly"}),200
    return jsonify({"response": "Pet not deleted"}), 400


@api.route('/pet/<int:pet_id>', methods=['PUT'])
@jwt_required()
def update_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()

    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    pet.name = request.form.get("name", pet.name)
    pet.age = request.form.get("age", pet.age)
    pet.race = request.form.get("race", pet.race)
    pet.castrated = request.form.get("castrated") == 'true'

    if 'image_pet' in request.files:
        image_file = request.files['image_pet']
        if image_file.filename != '':
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)
            # Reemplazar la imagen existente con la nueva
            if pet.image_pet_url:
                os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], os.path.basename(pet.image_pet_url)))
            pet.image_pet_url = f"https://5500-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/uploads/{filename}"

    db.session.commit()

    return jsonify({"message": "Pet updated successfully", "image_pet_url": pet.image_pet_url}), 200


# Línea para configurar la ruta estática
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')  # Obtén la ruta completa de la carpeta de uploads

@api.route('/uploads/<path:filename>')  # Define una ruta para servir archivos desde la carpeta uploads
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)  # Sirve el archivo desde la carpeta de uploads