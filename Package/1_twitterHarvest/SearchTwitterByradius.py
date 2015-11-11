import tweepy
import time
import couchdb
import os
import urllib
import json
import datetime


access_token = ""
access_token_secret = ""
consumer_key = ""
consumer_secret = ""

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth,wait_on_rate_limit=True,wait_on_rate_limit_notify=True)

if (not api):
    print ("Can't Authenticate")
    sys.exit(-1)

couch = couchdb.Server()
couch = couchdb.Server('URI CouchDB')
db = couch['mydb5']

#search condition
#Based on a central point in AU, set theradius
searchQuery=''
geo_radius='-28.87343728086593,130.78685474999997,14576.99km'

#set condition
maxTweets = 10000000
tweetsPerQry = 100

# If results from a specific ID onwards are reqd, set since_id to that ID.
# else default to no lower limit, go as far back as API allows
sinceId = None

# If results only below a specific ID are, set max_id to that ID.
# else default to no upper limit, start from the most recent tweet matching the search query.
max_id = -1L

tweetCount = 0
print("Downloading max {0} tweets".format(maxTweets))

while tweetCount < maxTweets:
        try:
            if (max_id <= 0):
                if (not sinceId):
                    new_tweets = api.search(geocode=geo_radius, count=tweetsPerQry)
                else:
                    new_tweets = api.search(geocode=geo_radius, count=tweetsPerQry,
                                            since_id=sinceId)
            else:
                if (not sinceId):
                    new_tweets = api.search(geocode=geo_radius, count=tweetsPerQry,
                                            max_id=str(max_id - 1))
                else:
                    new_tweets = api.search(geocode=geo_radius, count=tweetsPerQry,
                                            max_id=str(max_id - 1),
                                            since_id=sinceId)
            if not new_tweets:
                print("No more tweets found")
                break
            for tweet in new_tweets:
                doc={'_id':tweet.id_str,'content':tweet._json}
                db.save(doc)
            tweetCount += len(new_tweets)
            print("Downloaded {0} tweets".format(tweetCount))
            max_id = new_tweets[-1].id
        except tweepy.TweepError as e:
            # Just exit if any error
            print("some error : " + str(e))
        except BaseException as e:
            print(" error : " + str(e))
            

