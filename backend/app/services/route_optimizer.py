"""
Route optimization service using TomTom Maps API
Calculates optimal routes for ambulance dispatch
"""
from typing import List, Optional
from app.config import settings
from app.schemas.emergency import RouteOption
import logging
import math

logger = logging.getLogger(__name__)


class RouteOptimizer:
    def __init__(self):
        self.tomtom_api_key = settings.TOMTOM_API_KEY
    
    async def optimize_routes(
        self,
        emergency_lat: float,
        emergency_lon: float,
        ambulances: List[dict],
        hospital_lat: Optional[float] = None,
        hospital_lon: Optional[float] = None
    ) -> tuple[List[RouteOption], int]:
        """
        Optimize routes for all available ambulances
        
        Args:
            emergency_lat: Emergency location latitude
            emergency_lon: Emergency location longitude
            ambulances: List of available ambulance data
            hospital_lat: Hospital latitude (optional)
            hospital_lon: Hospital longitude (optional)
            
        Returns:
            Tuple of (list of route options, recommended ambulance ID)
        """
        try:
            routes = []
            
            for ambulance in ambulances:
                distance_km = self._calculate_distance(
                    emergency_lat, emergency_lon,
                    ambulance["latitude"], ambulance["longitude"]
                )
                
                # Estimate 30 km/h average speed in urban area
                duration_minutes = int((distance_km / 30) * 60)
                
                route = RouteOption(
                    ambulance_id=ambulance["id"],
                    ambulance_name=ambulance["name"],
                    distance_km=round(distance_km, 2),
                    duration_minutes=duration_minutes,
                    eta_minutes=duration_minutes,
                    route_polyline=None
                )
                routes.append(route)
            
            # Sort by ETA and recommend the best one
            routes.sort(key=lambda r: r.eta_minutes)
            recommended_id = routes[0].ambulance_id if routes else None
            
            logger.info(f"Optimized routes for {len(routes)} ambulances. Recommended: {recommended_id}")
            return routes, recommended_id
            
        except Exception as e:
            logger.error(f"Error optimizing routes: {str(e)}")
            raise
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate distance between two coordinates using Haversine formula
        
        Args:
            lat1, lon1: First coordinate
            lat2, lon2: Second coordinate
            
        Returns:
            Distance in kilometers
        """
        R = 6371  # Earth's radius in km
        
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_lat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(delta_lon / 2) ** 2)
        
        c = 2 * math.asin(math.sqrt(a))
        
        return R * c


route_optimizer = RouteOptimizer()
