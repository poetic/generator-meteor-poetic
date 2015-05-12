# Install
```
npm install meteor-poetic-scaffold
```

# Usage
```
meteor-generator route admin/show
# ./client/routes/admin/show/show.html
# ./client/routes/admin/show/show.js

meteor-generator component admin/show
# ./client/components/admin/show/show.html
# ./client/components/admin/show/show.js
```

# File Structure:
clients
  components:  things not routes, keep it flat
  packages:    wrapper around plugins(swaiper)
  stylesheets: css styles
  routes:      correspond to a route, nested like what the router indicates
  methods:     client only methods

collections: each file is for one collection

server
  methods: server only methods

methods: file name is the same as method name
