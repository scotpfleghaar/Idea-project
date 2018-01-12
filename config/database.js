if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb://test:test@ds249787.mlab.com:49787/idea-dev'}
} else {
    module.exports = {mongoURI:'mongodb://test:test@ds249787.mlab.com:49787/idea-dev'}
}