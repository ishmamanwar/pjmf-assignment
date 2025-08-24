from flask import Blueprint, request, jsonify
from app.services.covid_service import CovidService

covid_bp = Blueprint('covid', __name__, url_prefix='/api/covid')
covid_service = CovidService()


@covid_bp.route('', methods=['GET'])
def get_covid_data():
    """Get COVID-19 hospitalization data with pagination and sorting"""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 50)), 100)  # Max 100 per page
        sort_by = request.args.get('sort_by', 'date')
        sort_order = request.args.get('sort_order', 'desc')
        
        result = covid_service.get_all_records(
            page=page,
            per_page=per_page,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@covid_bp.route('/state/<state>', methods=['GET'])
def get_state_data(state):
    """Get COVID-19 data for a specific state"""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 50)), 100)
        sort_by = request.args.get('sort_by', 'date')
        sort_order = request.args.get('sort_order', 'desc')
        
        result = covid_service.search_by_state(
            state=state,
            page=page,
            per_page=per_page,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@covid_bp.route('/state/<state>/summary', methods=['GET'])
def get_state_summary(state):
    """Get summary statistics for a specific state"""
    try:
        result = covid_service.get_state_summary(state)
        
        if 'error' in result:
            return jsonify(result), 404
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@covid_bp.route('/trends', methods=['GET'])
def get_trends():
    """Get trends over time with optional filters"""
    try:
        # Get optional filter parameters
        state = request.args.get('state')
        age_category = request.args.get('age_category')
        sex = request.args.get('sex')
        race = request.args.get('race')
        
        result = covid_service.get_trends_over_time(
            state=state,
            age_category=age_category,
            sex=sex,
            race=race
        )
        
        return jsonify({
            'data': result,
            'filters': {
                'state': state,
                'age_category': age_category,
                'sex': sex,
                'race': race
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@covid_bp.route('/search', methods=['GET'])
def advanced_search():
    """Advanced search with multiple filters"""
    try:
        # Get all possible filter parameters
        state = request.args.get('state')
        season = request.args.get('season')
        age_category = request.args.get('age_category')
        sex = request.args.get('sex')
        race = request.args.get('race')
        
        # Rate range filters
        min_rate = request.args.get('min_rate')
        max_rate = request.args.get('max_rate')
        
        if min_rate:
            min_rate = float(min_rate)
        if max_rate:
            max_rate = float(max_rate)
        
        # Date range filters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Pagination and sorting
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 50)), 100)
        sort_by = request.args.get('sort_by', 'date')
        sort_order = request.args.get('sort_order', 'desc')
        
        result = covid_service.advanced_search(
            state=state,
            season=season,
            age_category=age_category,
            sex=sex,
            race=race,
            min_rate=min_rate,
            max_rate=max_rate,
            start_date=start_date,
            end_date=end_date,
            page=page,
            per_page=per_page,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@covid_bp.route('/filters', methods=['GET'])
def get_filter_options():
    """Get available filter options"""
    try:
        result = covid_service.get_filter_options()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@covid_bp.route('/health', methods=['GET'])
def covid_health_check():
    """Health check for COVID data service"""
    try:
        # Try to load a small sample of data to verify the service is working
        result = covid_service.get_all_records(page=1, per_page=1)
        
        return jsonify({
            "status": "ok",
            "message": "COVID-19 data service is operational",
            "total_records": result['pagination']['total_records']
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"COVID-19 data service error: {str(e)}"
        }), 500
