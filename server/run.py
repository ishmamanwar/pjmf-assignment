import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', 5001))
    
    print("Starting PJMF Flask Server - COVID-19 Data Dashboard...")
    print(f"COVID data: {os.getenv('COVID_DATA_FILE_PATH', '../data/rows.json')}")
    print(f"Server will be available at: http://{host}:{port}")
    print("\nAPI endpoints:")
    print("   GET    /api/health")
    print("\n--- COVID-19 Hospitalization Data API ---")
    print("   GET    /api/covid")
    print("   GET    /api/covid/state/<state>")
    print("   GET    /api/covid/state/<state>/summary")
    print("   GET    /api/covid/trends")
    print("   GET    /api/covid/search")
    print("   GET    /api/covid/filters")
    print("   GET    /api/covid/health")
    print("\nQuery parameters:")
    print("   ?page=1, ?per_page=50, ?sort_by=date, ?sort_order=desc")
    print("   ?state=<state>, ?season=<season>, ?age_category=<age>")
    print("   ?sex=<sex>, ?race=<race>, ?min_rate=<num>, ?max_rate=<num>")
    print("   ?start_date=<YYYY-MM-DD>, ?end_date=<YYYY-MM-DD>")
    print("\n" + "="*60 + "\n")
    
    app.run(host=host, port=port, debug=True)
