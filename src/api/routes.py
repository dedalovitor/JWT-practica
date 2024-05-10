"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Pet
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


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
    token = create_access_token(identity= user.id)
    
 
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
    print("@@@@@@@@")
    print(new_user.id)
    db.session.add(new_user)
    db.session.commit()
    print("@@@@@@@@")
    print(new_user.id)

 
    return jsonify({"response": "User registered successfully"}), 200


@api.route('/pet', methods=['POST'])
@jwt_required()
def create_pet():
    user_id = get_jwt_identity()
    body_name = request.json.get("name")
    body_age = request.json.get("age")
    body_race = request.json.get("race")
    body_castrated = request.json.get("castrated")   
    new_pet = Pet(name= body_name, age=int(body_age), race=body_race, castrated=body_castrated, user_id=user_id)
    db.session.add(new_pet)
    db.session.commit()

 
    return jsonify({"response": "Pet registered successfully"}), 200

@api.route('/pets', methods=['GET'])
@jwt_required()
def get_all_current_user_pets():
    user_id = get_jwt_identity()
    pets = Pet.query.filter_by(user_id=user_id)
    return jsonify({"results": [x.serialize() for x in pets]}), 200

@api.route('/pet/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.get(pet_id)
    if pet.user_id == user_id:
        db.session.delete(pet)
        db.session.commit()
        return jsonify({ "response": "Pet deleted correctly"}),200
    return jsonify({"response": "Pet not deleted"}), 400