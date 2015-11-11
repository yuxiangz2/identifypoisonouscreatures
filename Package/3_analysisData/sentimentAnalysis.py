# -*- coding: utf-8 -*-
import couchdb
import re
import nltk
from nltk.corpus import stopwords
# from nltk.probability import FreqDist
# # from nltk import collocations
# # from collections import Counter
#textblob
from textblob import TextBlob



couch = couchdb.Server()
couch = couchdb.Server('http://115.*.*.*:5984/')


db=couch['web_data']


#remove some unuseful words
stop = stopwords.words('english') + ['australia', 'beach', 'sydney','get','found','world','today']

count=0
word_lists=[]
for id in db:
    tweet=db[id]
    if tweet['_id']!='_design/all':
        # if tweet['lable']=='others':
            st=tweet['text']
            #remove https:\\....
            st=re.sub(r'(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?«»“”‘’]))', '', st)
            #input the tweet text
            blob=TextBlob(st)
            # print blob.noun_phrases
            totalscores=0
            for s in blob.sentences:
                #textblob just check each sentence not a whole tweet
                #so that I try to sum the total scores for each tweet
                totalscores=totalscores+s.sentiment.polarity           
                print s.sentiment.polarity
            #check whether the score of each tweet is beyong the limited scores (-1 to +1)
            if totalscores>1:
                totalscores=1
            elif totalscores<-1:
                totalscores=-1 
            print totalscores
            tweet['sentscore']=totalscores
            db.save(tweet)
            count+=1
print count


# bigram_measures = collocations.BigramAssocMeasures()
# bigram_finder = collocations.BigramCollocationFinder.from_words(word_lists)
 
# bigram_finder.apply_freq_filter(1)
# for bigram in bigram_finder.score_ngrams(bigram_measures.raw_freq)[:20]:
#     print bigram



