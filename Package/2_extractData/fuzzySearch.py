import couchdb
import json
import re

couch=couchdb.Server("http://115.*.*.*:5984/")

db_end1=couch['spider_trainingdata_s']
# db_end2=couch.create('snake_trainingdata_s')
# db_end3=couch.create('others_trainingdata_s')

db_start=couch['outsource']


#process the key words and increasing more types of key words
def alianwords(tar_list):
	new_list=[];
	if tar_list:		
		for word in tar_list:
			if word.find(" ")!=-1:
				new_list.append(word.replace(" ","-").lower())
				new_list.append(word.replace(" ","").lower())
			else:
				new_list.append(word.lower())
	return new_list

#remove inteference that includes @user https.. but keep the #topic
def formatText(text):
	str=text.replace("#"," ")
	str=re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)"," ",str)
	str=str.lower()
	return str

#fuzzy search
def classifytweets(db_end,new_list):
	print 'start to classify'
	for id in db_start:
		tweet=db_start[id]
		twstr=formatText(tweet['text'])
		for key in new_list:
			#re for single word
			s=re.search(key,str,re.IGNORECASE)
			if s:
				db_end.save(tweet)
	print 'End'






if __name__ == '__main__':

	spider_animal=['spider','funnel web','red back','trapdoor','black widow','brazilian wandering',
	'trap door','white tailed','tarantula','recluse','fiddleback','fiddle back','huntsman','orb weaver','black house']


	snake_list=['snake','taipan','fierce','small-scaled','eastern brown','western brown','gwardar','yellow-bellied','king cobra',
	'hook-nosed','death adder','small-eyed','mulga','king brown','red-bellied','collett','blue-bellied','belcher','copperhead']

	others_list=['cone snail','conus','cone shell','box jellyfish','irukandji','blue ringed','blue bottle''stonefish','synanceia',
	'toad fish','paralysis','centipede','bull ant','myrmecia','scorpion','gila monster','katipo']

	classifytweets(db_end1,alianwords(spider_animal))
	# classifytweets(db_end2,alianwords(snake_list))
	# classifytweets(db_end3,alianwords(others_list))

