#using NLTK library, we can do lot of text preprocesing
import nltk
from nltk.tokenize import word_tokenize

#function to split text into word
tokens = word_tokenize("The quick brown fox jumps over the lazy dog")
# nltk.download('punkt')
# nltk.download('stopwords')
# print(tokens)


from nltk.corpus import stopwords
stop_words = set(stopwords.words("english"))
tokens = [w for w in tokens if not w in stop_words]
print(tokens)



#NLTK provides several stemmer interfaces like Porter stemmer, #Lancaster Stemmer, Snowball Stemmer
from nltk.stem.porter import PorterStemmer
porter = PorterStemmer()
stems = []
for t in tokens:    
    stems.append(porter.stem(t))
print(stems)
