import os
from typing import List, Dict, Any, Optional
from app.utils.covid_data_parser import CovidDataParser


class CovidService:
    """Service for COVID-19 hospitalization data operations"""
    
    def __init__(self, data_file_path: str = None):
        if data_file_path is None:
            data_file_path = os.getenv('COVID_DATA_FILE_PATH', '../data/rows.json')
        self.data_parser = CovidDataParser(data_file_path)
    
    def get_all_records(self, 
                       page: int = 1, 
                       per_page: int = 50,
                       sort_by: str = 'date',
                       sort_order: str = 'desc') -> Dict[str, Any]:
        """Get all records with pagination and sorting"""
        
        data = self.data_parser.parse_data()
        
        # Apply sorting
        data = self._sort_data(data, sort_by, sort_order)
        
        # Apply pagination
        total_records = len(data)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_data = data[start_idx:end_idx]
        
        return {
            'data': paginated_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total_records': total_records,
                'total_pages': (total_records + per_page - 1) // per_page,
                'has_next': end_idx < total_records,
                'has_prev': page > 1
            }
        }
    
    def search_by_state(self, 
                       state: str,
                       page: int = 1,
                       per_page: int = 50,
                       sort_by: str = 'date',
                       sort_order: str = 'desc') -> Dict[str, Any]:
        """Get records filtered by state"""
        
        data = self.data_parser.parse_data()
        
        # Filter by state (case-insensitive)
        filtered_data = [
            record for record in data 
            if record['state'] and state.lower() in record['state'].lower()
        ]
        
        # Apply sorting
        filtered_data = self._sort_data(filtered_data, sort_by, sort_order)
        
        # Apply pagination
        total_records = len(filtered_data)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_data = filtered_data[start_idx:end_idx]
        
        return {
            'data': paginated_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total_records': total_records,
                'total_pages': (total_records + per_page - 1) // per_page,
                'has_next': end_idx < total_records,
                'has_prev': page > 1
            },
            'filters': {'state': state}
        }
    
    def get_state_summary(self, state: str) -> Dict[str, Any]:
        """Get summary statistics for a specific state"""
        
        data = self.data_parser.parse_data()
        
        # Filter by exact state match
        state_data = [
            record for record in data 
            if record['state'] and record['state'].lower() == state.lower()
        ]
        
        if not state_data:
            return {'error': 'State not found'}
        
        # Calculate summary statistics
        rates = [record['monthly_rate'] for record in state_data if record['monthly_rate'] is not None]
        
        summary = {
            'state': state,
            'total_records': len(state_data),
            'date_range': self._get_date_range(state_data),
            'statistics': {
                'avg_rate': sum(rates) / len(rates) if rates else 0,
                'max_rate': max(rates) if rates else 0,
                'min_rate': min(rates) if rates else 0,
                'total_months': len(set(record['year_month'] for record in state_data))
            },
            'seasons': list(set(record['season'] for record in state_data if record['season'])),
            'age_categories': list(set(record['age_category'] for record in state_data if record['age_category']))
        }
        
        return summary
    
    def get_trends_over_time(self, 
                           state: Optional[str] = None,
                           age_category: Optional[str] = None,
                           sex: Optional[str] = None,
                           race: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get trends over time with optional filters"""
        
        data = self.data_parser.parse_data()
        
        # Apply filters
        filtered_data = data
        
        if state:
            filtered_data = [r for r in filtered_data if r['state'] and r['state'].lower() == state.lower()]
        
        if age_category:
            filtered_data = [r for r in filtered_data if r['age_category'] and r['age_category'].lower() == age_category.lower()]
        
        if sex:
            filtered_data = [r for r in filtered_data if r['sex'] and r['sex'].lower() == sex.lower()]
        
        if race:
            filtered_data = [r for r in filtered_data if r['race'] and r['race'].lower() == race.lower()]
        
        # Group by year-month and calculate averages
        trends = {}
        for record in filtered_data:
            key = record['year_month']
            if key not in trends:
                trends[key] = {
                    'year_month': key,
                    'date': record['date'],
                    'formatted_date': record['formatted_date'],
                    'rates': [],
                    'count': 0
                }
            
            if record['monthly_rate'] is not None:
                trends[key]['rates'].append(record['monthly_rate'])
                trends[key]['count'] += 1
        
        # Calculate averages and sort by date
        trend_list = []
        for trend in trends.values():
            if trend['rates']:
                trend['avg_rate'] = sum(trend['rates']) / len(trend['rates'])
                trend['max_rate'] = max(trend['rates'])
                trend['min_rate'] = min(trend['rates'])
            else:
                trend['avg_rate'] = 0
                trend['max_rate'] = 0
                trend['min_rate'] = 0
            
            # Remove the rates array from response
            del trend['rates']
            trend_list.append(trend)
        
        # Sort by date
        trend_list.sort(key=lambda x: x['date'] if x['date'] else '')
        
        return trend_list
    
    def get_filter_options(self) -> Dict[str, List[str]]:
        """Get available filter options"""
        
        return {
            'states': self.data_parser.get_unique_states(),
            'seasons': self.data_parser.get_unique_seasons(),
            'age_categories': self.data_parser.get_unique_age_categories(),
            'sex': self.data_parser.get_unique_sex(),
            'race': self.data_parser.get_unique_race(),
            'date_range': self.data_parser.get_date_range()
        }
    
    def advanced_search(self,
                       state: Optional[str] = None,
                       season: Optional[str] = None,
                       age_category: Optional[str] = None,
                       sex: Optional[str] = None,
                       race: Optional[str] = None,
                       min_rate: Optional[float] = None,
                       max_rate: Optional[float] = None,
                       start_date: Optional[str] = None,
                       end_date: Optional[str] = None,
                       page: int = 1,
                       per_page: int = 50,
                       sort_by: str = 'date',
                       sort_order: str = 'desc') -> Dict[str, Any]:
        """Advanced search with multiple filters"""
        
        data = self.data_parser.parse_data()
        
        # Apply filters
        filtered_data = data
        
        if state:
            filtered_data = [r for r in filtered_data if r['state'] and r['state'].lower() == state.lower()]
        
        if season:
            filtered_data = [r for r in filtered_data if r['season'] and r['season'].lower() == season.lower()]
        
        if age_category:
            filtered_data = [r for r in filtered_data if r['age_category'] and r['age_category'].lower() == age_category.lower()]
        
        if sex:
            filtered_data = [r for r in filtered_data if r['sex'] and r['sex'].lower() == sex.lower()]
        
        if race:
            filtered_data = [r for r in filtered_data if r['race'] and r['race'].lower() == race.lower()]
        
        if min_rate is not None:
            filtered_data = [r for r in filtered_data if r['monthly_rate'] is not None and r['monthly_rate'] >= min_rate]
        
        if max_rate is not None:
            filtered_data = [r for r in filtered_data if r['monthly_rate'] is not None and r['monthly_rate'] <= max_rate]
        
        if start_date:
            filtered_data = [r for r in filtered_data if r['date'] and r['date'] >= start_date]
        
        if end_date:
            filtered_data = [r for r in filtered_data if r['date'] and r['date'] <= end_date]
        
        # Apply sorting
        filtered_data = self._sort_data(filtered_data, sort_by, sort_order)
        
        # Apply pagination
        total_records = len(filtered_data)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_data = filtered_data[start_idx:end_idx]
        
        return {
            'data': paginated_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total_records': total_records,
                'total_pages': (total_records + per_page - 1) // per_page,
                'has_next': end_idx < total_records,
                'has_prev': page > 1
            },
            'filters': {
                'state': state,
                'season': season,
                'age_category': age_category,
                'sex': sex,
                'race': race,
                'min_rate': min_rate,
                'max_rate': max_rate,
                'start_date': start_date,
                'end_date': end_date
            }
        }
    
    def _sort_data(self, data: List[Dict[str, Any]], sort_by: str, sort_order: str) -> List[Dict[str, Any]]:
        """Sort data by specified field and order"""
        
        reverse = sort_order.lower() == 'desc'
        
        if sort_by == 'date':
            return sorted(data, key=lambda x: x['date'] if x['date'] else '', reverse=reverse)
        elif sort_by == 'state':
            return sorted(data, key=lambda x: x['state'] if x['state'] else '', reverse=reverse)
        elif sort_by == 'rate':
            return sorted(data, key=lambda x: x['monthly_rate'] if x['monthly_rate'] is not None else -1, reverse=reverse)
        elif sort_by == 'season':
            return sorted(data, key=lambda x: x['season'] if x['season'] else '', reverse=reverse)
        elif sort_by == 'age_category':
            return sorted(data, key=lambda x: x['age_category'] if x['age_category'] else '', reverse=reverse)
        elif sort_by == 'sex':
            return sorted(data, key=lambda x: x['sex'] if x['sex'] else '', reverse=reverse)
        elif sort_by == 'race':
            return sorted(data, key=lambda x: x['race'] if x['race'] else '', reverse=reverse)
        else:
            # Default to date sorting
            return sorted(data, key=lambda x: x['date'] if x['date'] else '', reverse=reverse)
    
    def _get_date_range(self, data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Get date range for a subset of data"""
        
        dates = [record['date'] for record in data if record['date']]
        
        if not dates:
            return {'start': None, 'end': None}
        
        return {
            'start': min(dates),
            'end': max(dates)
        }
