import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime


class CovidDataParser:
    """Utility class for parsing and processing COVID-19 hospitalization data"""
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        self._raw_data = None
        self._parsed_data = None
    
    def _load_raw_data(self) -> Dict[str, Any]:
        """Load raw JSON data from file"""
        if self._raw_data is None:
            try:
                if not os.path.exists(self.file_path):
                    raise FileNotFoundError(f"COVID data file not found: {self.file_path}")
                
                with open(self.file_path, 'r', encoding='utf-8') as file:
                    self._raw_data = json.load(file)
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error loading COVID data file {self.file_path}: {e}")
                raise e
        
        return self._raw_data
    
    def _get_column_mapping(self) -> Dict[str, int]:
        """Extract column positions from metadata"""
        raw_data = self._load_raw_data()
        columns = raw_data.get('meta', {}).get('view', {}).get('columns', [])
        
        mapping = {}
        visible_position = 0
        
        for col in columns:
            if col.get('flags') and 'hidden' in col.get('flags', []):
                continue
            
            field_name = col.get('fieldName', '').replace(':', '')
            if field_name:
                mapping[field_name] = visible_position
                visible_position += 1
        
        return mapping
    
    def _parse_year_month(self, year_month_str: str) -> Dict[str, Any]:
        """Parse year-month string into components"""
        try:
            # Remove .0 suffix and convert to string
            ym = str(year_month_str).replace('.0', '')
            if len(ym) == 6:
                year = int(ym[:4])
                month = int(ym[4:])
                
                # Create a proper date for sorting
                date_obj = datetime(year, month, 1)
                
                return {
                    'year': year,
                    'month': month,
                    'date': date_obj.isoformat(),
                    'month_name': date_obj.strftime('%B'),
                    'formatted': f"{date_obj.strftime('%B')} {year}"
                }
        except (ValueError, IndexError):
            pass
        
        return {
            'year': None,
            'month': None,
            'date': None,
            'month_name': None,
            'formatted': year_month_str
        }
    
    def parse_data(self) -> List[Dict[str, Any]]:
        """Parse raw data into structured objects"""
        if self._parsed_data is not None:
            return self._parsed_data
        
        raw_data = self._load_raw_data()
        data_rows = raw_data.get('data', [])
        column_mapping = self._get_column_mapping()
        
        parsed_records = []
        
        for i, row in enumerate(data_rows):
            if len(row) < 8:  # Skip incomplete rows
                continue
            
            try:
                # Extract visible columns (skip metadata columns)
                visible_data = row[8:]  # Skip first 8 metadata columns
                
                if len(visible_data) < 6:  # Ensure we have all required columns
                    continue
                
                year_month_data = self._parse_year_month(visible_data[2])
                
                record = {
                    'id': i + 1,  # Generate unique ID
                    'state': visible_data[0],
                    'season': visible_data[1],
                    'year_month': visible_data[2],
                    'year': year_month_data['year'],
                    'month': year_month_data['month'],
                    'date': year_month_data['date'],
                    'month_name': year_month_data['month_name'],
                    'formatted_date': year_month_data['formatted'],
                    'age_category': visible_data[3],
                    'sex': visible_data[4],
                    'race': visible_data[5],
                    'monthly_rate': self._parse_rate(visible_data[6]) if len(visible_data) > 6 else None,
                    'rate_type': visible_data[7] if len(visible_data) > 7 else 'Crude Rate'
                }
                
                parsed_records.append(record)
                
            except (IndexError, ValueError) as e:
                print(f"Error parsing row {i}: {e}")
                continue
        
        self._parsed_data = parsed_records
        return self._parsed_data
    
    def _parse_rate(self, rate_str: str) -> Optional[float]:
        """Parse rate string to float"""
        try:
            if rate_str and rate_str.strip():
                return float(rate_str)
        except ValueError:
            pass
        return None
    
    def get_unique_states(self) -> List[str]:
        """Get list of unique states"""
        data = self.parse_data()
        states = list(set(record['state'] for record in data if record['state']))
        return sorted(states)
    
    def get_unique_seasons(self) -> List[str]:
        """Get list of unique seasons"""
        data = self.parse_data()
        seasons = list(set(record['season'] for record in data if record['season']))
        return sorted(seasons)
    
    def get_unique_age_categories(self) -> List[str]:
        """Get list of unique age categories"""
        data = self.parse_data()
        categories = list(set(record['age_category'] for record in data if record['age_category']))
        return sorted(categories)
    
    def get_unique_sex(self) -> List[str]:
        """Get list of unique sex values"""
        data = self.parse_data()
        sex_values = list(set(record['sex'] for record in data if record['sex']))
        return sorted(sex_values)
    
    def get_unique_race(self) -> List[str]:
        """Get list of unique race values"""
        data = self.parse_data()
        race_values = list(set(record['race'] for record in data if record['race']))
        return sorted(race_values)
    
    def get_date_range(self) -> Dict[str, Any]:
        """Get the date range of the data"""
        data = self.parse_data()
        dates = [record['date'] for record in data if record['date']]
        
        if not dates:
            return {'start': None, 'end': None}
        
        return {
            'start': min(dates),
            'end': max(dates)
        }
