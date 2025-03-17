from flask import Flask, jsonify
from flask_cors import CORS
from nepse_scraper import Nepse_scraper
import os

app = Flask(__name__)
CORS(app)

# create object from Nepse_scraper class
request_obj = Nepse_scraper()

@app.route('/')

def home():
  """Root endpoint with basic instructions"""
  return """
    <h1>NEPSE Data API</h1>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/today-price">/today-price</a> - Get today's prices</li>
    </ul>
    """

@app.route('/today-price')
def get_today_price():
  """Endpoint to fetch and return today's prices"""
  try:
    # getting today's price from nepse
    today_price = request_obj.get_today_price()
    
    # Return formatted JSON response
    return jsonify({
      "status": "success",
      "data": today_price,
      "messsage": "Today's prices retrieved successfully"
    })
    
  except Exception as e:
      #Handle errors
      return jsonify({
            "status": "error",
            "data": None,
            "message": f"Failed to retrieve data: {str(e)}"
        }), 500
      
      
if __name__ == '__main__':
   # Run the Flask app with configurable host and port
    app.run(
        host='127.0.0.1',
        port=int(os.environ.get('PORT', 5000)),
        debug=True  # Remove debug=True in production
    )
