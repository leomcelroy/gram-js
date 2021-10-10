if [ $1 == "run" ]; then
  deno run --allow-net --allow-read server.js
elif [ $1 == "bundle" ]; then
	deno cache --reload ./exports.js
  	deno bundle ./exports.js bundle.js
  	echo "Bundled it."
else
  echo "Command not recognized."
fi