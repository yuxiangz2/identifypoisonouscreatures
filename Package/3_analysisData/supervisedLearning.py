# -*- coding: utf-8 -*-
import couchdb
import re
import nltk
from nltk.corpus import stopwords
from nltk.probability import FreqDist


couch = couchdb.Server()
couch = couchdb.Server('http://115.*.*.*:5984/')

#Before using supervised learning, it should have some data labeled manually in the database of training data
#db_feature_sn=couch['snake_trainingdata']
db_feature_sp=couch['spider_trainingdata']
# db_feature_ot=couch['others_trainingdata']


tweets=[]

print "program is starting!"

#remove HTML and all inrelevant information (@, #, )
def formatText(text):
	str=text.replace("#"," ")
	str=re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)"," ",str)
	str=str.lower()
	return str

#collection of features on Frequency
def get_words_in_tweets(tweets):

    all_words = []
    for (words, sentiment) in tweets:
      all_words.extend(words)
    return all_words

def get_word_features(wordlist):

    wordlist = nltk.FreqDist(wordlist)
    word_features = wordlist.keys()
    return word_features


#extract feature
#Set - nonredundant dataset in the style of abcd-->([a,b,c,d])
def extract_features(document):
    document_words = set(document)
    features = {}
    for word in word_features:
        features['contains(%s)' % word] = (word in document_words)
    return features

#stop that remove the inrelevant words
stop = stopwords.words('english')

for id in db_feature_sp:
	tweet=db_feature_sp[id]
	str=formatText(tweet['text'])
	words_filtered=[i.lower() for i in str.split() if i not in stop and len(i)>=3]
	tweets.append((words_filtered,tweet['lable']))

#print tweets
word_features = get_word_features(get_words_in_tweets(tweets))
#print word_features
training_set = nltk.classify.apply_features(extract_features, tweets)
#print training_set
#produce a classifier by naivebayes
classifier = nltk.NaiveBayesClassifier.train(training_set)
print classifier.show_most_informative_features(30)
print '################## success to produce classifier! ##################'


###############################Above is to produce classifier#########################
#input the text of twitter and then use classifier to identified
#print classifier.classify(extract_features(str))
###############################Below is to use classifier#########################

	

db_input=couch['bigdatabase']
db_end=couch['web_data']

for id in db_input:
	pass
	try:		
		tweet=db_input[id]
		str=tweet['text']
		str=formatText(str).lower().split()
		
		if classifier.classify(extract_features(str))==1:
			#depend on training data
			#Here, I choose to classify one species in one time
			tweet['lable']='spider'
			db_end.save(tweet)
			print 'success'		
		else:
			pass
	except BaseException as e:
            print(" error : " + str(e))





