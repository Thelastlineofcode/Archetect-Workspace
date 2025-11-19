"""
Archetect Astrology Engine - Birth Chart Calculator
Uses PyMeeus for sidereal calculations
"""

import json
import sys
from datetime import datetime
from typing import Dict, Any
import pytz  # pylint: disable=import-error
from pymeeus import Sun, Moon  # pylint: disable=import-error
from pymeeus.Epoch import Epoch  # pylint: disable=import-error

# Lahiri Ayanamsha value (approximate for 2025)
LAHIRI_AYANAMSHA = 24.15  # degrees


class BirthChartCalculator:
    """Calculate sidereal birth chart from birth data"""

    def __init__(  # pylint: disable=too-many-arguments
        self,
        birth_date: str,
        birth_time: str,
        *,
        latitude: float,
        longitude: float,
        timezone_str: str
    ):
        """
        Initialize birth chart calculator

        Args:
            birth_date: YYYY-MM-DD format
            birth_time: HH:MM:SS format
            latitude: Decimal degrees (-90 to 90) (keyword-only)
            longitude: Decimal degrees (-180 to 180) (keyword-only)
            timezone_str: IANA timezone string (keyword-only)
                (e.g., 'America/New_York')
        """
        self.birth_date = datetime.fromisoformat(birth_date).date()
        self.birth_time = datetime.strptime(birth_time, '%H:%M:%S').time()
        self.latitude = latitude
        self.longitude = longitude
        self.timezone = pytz.timezone(timezone_str)

        # Create UTC datetime
        naive_dt = datetime.combine(self.birth_date, self.birth_time)
        local_dt = self.timezone.localize(naive_dt)
        self.utc_dt = local_dt.astimezone(pytz.UTC)

        # Convert to Julian Day
        year = self.utc_dt.year
        month = self.utc_dt.month
        hours = self.utc_dt.hour
        minutes = self.utc_dt.minute
        seconds = self.utc_dt.second
        day = (
            self.utc_dt.day +
            (hours + minutes/60.0 + seconds/3600.0) / 24.0
        )

        self.epoch = Epoch(year, month, day)

    @staticmethod
    def tropical_to_sidereal(tropical_longitude: float) -> float:
        """Convert tropical longitude to sidereal"""
        sidereal = tropical_longitude - LAHIRI_AYANAMSHA
        if sidereal < 0:
            sidereal += 360
        return sidereal

    @staticmethod
    def get_zodiac_sign(longitude: float) -> str:
        """Get zodiac sign from longitude (0-360 degrees)"""
        signs = [
            'Aries', 'Taurus', 'Gemini', 'Cancer',
            'Leo', 'Virgo', 'Libra', 'Scorpio',
            'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ]
        sign_index = int(longitude / 30)
        return signs[sign_index % 12]

    @staticmethod
    def get_modality(sign: str) -> str:
        """Get modality for a zodiac sign"""
        cardinal = ['Aries', 'Cancer', 'Libra', 'Capricorn']
        fixed = ['Taurus', 'Leo', 'Scorpio', 'Aquarius']

        if sign in cardinal:
            return 'Cardinal'
        if sign in fixed:
            return 'Fixed'
        return 'Mutable'

    @staticmethod
    def get_element(sign: str) -> str:
        """Get element for a zodiac sign"""
        fire = ['Aries', 'Leo', 'Sagittarius']
        earth = ['Taurus', 'Virgo', 'Capricorn']
        air = ['Gemini', 'Libra', 'Aquarius']

        if sign in fire:
            return 'Fire'
        if sign in earth:
            return 'Earth'
        if sign in air:
            return 'Air'
        return 'Water'

    @staticmethod
    def get_nakshatra(longitude: float) -> tuple[str, str]:
        """
        Get nakshatra from sidereal longitude
        Returns: (nakshatra_name, ruling_planet)
        """
        nakshatras = [
            ('Ashwini', 'Ketu'),
            ('Bharani', 'Venus'),
            ('Krittika', 'Sun'),
            ('Rohini', 'Moon'),
            ('Mrigashira', 'Mars'),
            ('Ardra', 'Rahu'),
            ('Punarvasu', 'Jupiter'),
            ('Pushya', 'Saturn'),
            ('Ashlesha', 'Mercury'),
            ('Magha', 'Ketu'),
            ('Purva Phalguni', 'Venus'),
            ('Uttara Phalguni', 'Sun'),
            ('Hasta', 'Moon'),
            ('Chitra', 'Mars'),
            ('Swati', 'Rahu'),
            ('Vishakha', 'Jupiter'),
            ('Anuradha', 'Saturn'),
            ('Jyeshtha', 'Mercury'),
            ('Mula', 'Ketu'),
            ('Purva Ashadha', 'Venus'),
            ('Uttara Ashadha', 'Sun'),
            ('Shravana', 'Moon'),
            ('Dhanishta', 'Mars'),
            ('Shatabhisha', 'Rahu'),
            ('Purva Bhadrapada', 'Jupiter'),
            ('Uttara Bhadrapada', 'Saturn'),
            ('Revati', 'Mercury'),
        ]

        # Each nakshatra is 13.333... degrees (360/27)
        nakshatra_index = int(longitude / (360.0 / 27))
        return nakshatras[nakshatra_index % 27]

    def calculate_sun_position(self) -> Dict[str, Any]:
        """Calculate Sun position"""
        sun_lon = Sun.geometric_geocentric_position(self.epoch)[0]
        tropical_lon = float(sun_lon)

        sidereal_lon = self.tropical_to_sidereal(tropical_lon)
        sign = self.get_zodiac_sign(sidereal_lon)
        nakshatra, nakshatra_ruler = self.get_nakshatra(sidereal_lon)

        return {
            'sign': sign,
            'siderealDegree': round(sidereal_lon % 30, 2),
            'nakshatra': nakshatra,
            'nakshatraRuler': nakshatra_ruler,
            'modality': self.get_modality(sign),
            'element': self.get_element(sign)
        }

    def calculate_moon_position(self) -> Dict[str, Any]:
        """Calculate Moon position"""
        moon_lon = Moon.geometric_geocentric_position(self.epoch)[0]
        tropical_lon = float(moon_lon)

        sidereal_lon = self.tropical_to_sidereal(tropical_lon)
        sign = self.get_zodiac_sign(sidereal_lon)
        nakshatra, nakshatra_ruler = self.get_nakshatra(sidereal_lon)

        return {
            'sign': sign,
            'siderealDegree': round(sidereal_lon % 30, 2),
            'nakshatra': nakshatra,
            'nakshatraRuler': nakshatra_ruler,
            'modality': self.get_modality(sign),
            'element': self.get_element(sign)
        }

    def calculate_chart(self) -> Dict[str, Any]:
        """Calculate complete birth chart"""
        sun_pos = self.calculate_sun_position()
        moon_pos = self.calculate_moon_position()

        # For MVP, we'll use Sun sign for Ascendant (placeholder)
        # In production, this should calculate actual Ascendant based on local time
        ascendant = sun_pos.copy()

        # Mercury position (simplified - same as Sun for MVP)
        # In production, calculate actual Mercury position
        mercury = sun_pos.copy()

        return {
            'sunSign': sun_pos,
            'moonSign': moon_pos,
            'ascendant': ascendant,
            'mercurySign': mercury,
            '_metadata': {
                'ephemerisSource': 'pymeeus_v0.5',
                'ayanamsha': 'lahiri',
                'ayanamshaValue': LAHIRI_AYANAMSHA,
                'houseSystem': 'placidus',
                'computedAt': datetime.utcnow().isoformat() + 'Z'
            }
        }


def main():
    """CLI interface for testing"""
    if len(sys.argv) < 6:
        usage_msg = (
            "Usage: python birth_chart.py "
            "<date> <time> <lat> <lon> <timezone>"
        )
        example_msg = (
            "Example: python birth_chart.py "
            "1992-03-15 14:30:00 29.7604 -95.3698 'America/Chicago'"
        )
        print(usage_msg)
        print(example_msg)
        sys.exit(1)

    birth_date = sys.argv[1]
    birth_time = sys.argv[2]
    latitude = float(sys.argv[3])
    longitude = float(sys.argv[4])
    timezone_str = sys.argv[5]

    try:
        calculator = BirthChartCalculator(
            birth_date,
            birth_time,
            latitude=latitude,
            longitude=longitude,
            timezone_str=timezone_str
        )
        chart = calculator.calculate_chart()
        print(json.dumps(chart, indent=2))
    except (ValueError, KeyError, pytz.exceptions.UnknownTimeZoneError) as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
