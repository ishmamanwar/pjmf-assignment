from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.covid import covid_bp

def create_app():
    app = Flask(__name__)
    
    CORS(app)
    
    app.register_blueprint(covid_bp)
    
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})
    
    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
