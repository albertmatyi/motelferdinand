// used by the compile_js.sh from the apps root
({
	appDir : "../",
	baseUrl : "js",
	dir : "../js-build",
	mainConfigFile : 'main.admin.js',
	paths : {
		'main' : 'main.admin'
	},
	modules : [
		{
			name : "main"
		}
	]
})