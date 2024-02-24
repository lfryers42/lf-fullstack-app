from flask import Flask, jsonify, make_response, request
import uuid, random

app = Flask(__name__)
'''
businesses = [
    {
        "id": str(uuid.uuid1()),
        "name": "Pizza Mountain",
        "town": "Coleraine",
        "rating": 5,
        "reviews": []
    },
    {
        "id": str(uuid.uuid1()),
        "name": "Wine Lake",
        "town": "Ballymoney",
        "rating": 3,
        "reviews": []
    },
    {
        "id": str(uuid.uuid1()),
        "name": "Sweet Desert",
        "town": "Ballymena",
        "rating": 4,
        "reviews": []
    }
]
'''
@app.route("/api/v1.0/businesses", methods=["GET"]) 
def show_all_businesses():
    page_num, page_size = 1, 10
    if request.args.get('pn'):
        page_num = int(request.args.get('pn'))
    if request.args.get('ps'):
        page_size = int(request.args.get('ps'))
    page_start = (page_size * (page_num - 1))
    businesses_list = [{k:v} for k, v in businesses.items()]
    data_to_return = businesses_list[page_start:page_start + page_size]
    return make_response(jsonify(data_to_return), 200)


@app.route("/api/v1.0/businesses/<string:id>", methods=["GET"])
def show_one_business(id):
        return make_response(jsonify(businesses[id]), 200)

@app.route("/api/v1.0/businesses", methods=["POST"]) 
def add_business():
    if "name" in request.form and "town" in request.form and "rating" in request.form:
        new_id = str(uuid.uuid1())
        new_business = {
            "id": new_id,
            "name": request.form["name"], 
            "town": request.form["town"], 
            "rating": int(request.form["rating"]),  # Convert rating to int
            "reviews": []
        } 
        businesses[new_id] = new_business
        return make_response(jsonify({new_id : new_business}), 201)
    else:
        return make_response(jsonify({ "error" : "Missing form data" }), 400)


@app.route("/api/v1.0/businesses/<string:id>", methods=["DELETE"])
def delete_business(id):
    if id in businesses:
        del businesses[id]
        return make_response(jsonify({}), 204)
    else:
        return make_response( jsonify({ "error" : "Invalid business ID" } ), 404 )

@app.route("/api/v1.0/businesses/<string:id>/reviews", methods=["GET"])
def fetch_all_reviews(id):
    return make_response(jsonify(businesses[id]["reviews"]), 200)

@app.route("/api/v1.0/businesses/<string:b_id>/reviews/<string:r_id>", methods=["GET"])
def fetch_one_review(b_id, r_id):
    if b_id in businesses:
        for review in businesses[b_id]["reviews"]:
            if review["id"] == r_id:
                return make_response(jsonify(review), 200)
        return make_response(jsonify({ "error" : "Review not found" }), 404)
    else:
        return make_response(jsonify({ "error" : "Business not found" }), 404)

@app.route("/api/v1.0/businesses/<string:id>/reviews", methods=["POST"])
def add_new_review(id):
    if id in businesses:
        new_review_id = str(uuid.uuid1())
        new_review = {
            "id": new_review_id,
            "username": request.form["username"],
            "comment": request.form["comment"],
            "stars": int(request.form["stars"])
        }
        businesses[id]["reviews"].append(new_review)
        return make_response(jsonify(new_review), 201)
    else:
        return make_response(jsonify({ "error" : "Business not found" }), 404)

@app.route("/api/v1.0/businesses/<string:b_id>/reviews/<string:r_id>", methods=["PUT"])
def edit_review(b_id, r_id):
    if b_id in businesses:
        for review in businesses[b_id]["reviews"]:
            if review["id"] == r_id:
                review["username"] = request.form["username"]
                review["comment"] = request.form["comment"]
                review["stars"] = int(request.form["stars"])
                return make_response(jsonify(review), 200)
        return make_response(jsonify({ "error" : "Review not found" }), 404)
    else:
        return make_response(jsonify({ "error" : "Business not found" }), 404)

@app.route("/api/v1.0/businesses/<string:b_id>/reviews/<string:r_id>", methods=["DELETE"])
def delete_review(b_id, r_id):
    if b_id in businesses:
        for review in businesses[b_id]["reviews"]:
            if review["id"] == r_id:
                businesses[b_id]["reviews"].remove(review)
                return make_response(jsonify({}), 200)
        return make_response(jsonify({ "error" : "Review not found" }), 404)
    else:
        return make_response(jsonify({ "error" : "Business not found" }), 404)

def generate_dummy_data():
    towns = ['Coleraine', 'Banbridge', 'Belfast', 'Lisburn', 'Ballymena', 'Derry', 'Newry', 'Enniskillen', 'Omagh', 'Ballymena']
    business_dict = {}
    for i in range(100):
        id = str(uuid.uuid1())
        name = "Biz " + str(i)
        town = towns[random.randint(0, len(towns)-1)]
        rating = random.randint(1, 5)
        business_dict[id] = {
            "name" : name,
            "town" : town,
            "rating" : rating,
            "reviews" : []
        }
    return business_dict


if __name__ == "__main__":
    businesses = generate_dummy_data()
    app.run(debug=True)
