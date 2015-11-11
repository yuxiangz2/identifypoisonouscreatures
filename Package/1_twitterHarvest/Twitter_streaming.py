#Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json
import re
import couchdb

#Variables that contains the user credentials to access Twitter API 
access_token = ""
access_token_secret = ""
consumer_key = ""
consumer_secret = ""

#define the Austalia Coordinates
Australia = [112.9,-44.8,159.3,-9.2]

#This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):

    def on_data(self, data):
    	try:
			tweet = json.loads(data)
			#doc={'_id':tweet['id_str'],'content':tweet['_json']}
			db.save(tweet)

			return True

    	except BaseException, e:    		
    		print 'failed ondata,',str(e)

    def on_error(self, status):
        print status


if __name__ == '__main__':
	#CouchDB URI :http://115.*.*.*:5984/
	couch = couchdb.Server('')
	#database name
	db = couch['']
	l = StdOutListener()
	auth = OAuthHandler(consumer_key, consumer_secret)
	auth.set_access_token(access_token, access_token_secret)
	twitterStream = Stream(auth, l)
	twitterStream.filter(locations = Australia)