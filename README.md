# Install
```
npm install generator-meteor-poetic
```

# Usage
```
# You can create an alias
# alias mg='yo meteor-poetic'

yo meteor-poetic
# generate a new meteor project

yo meteor-poetic route admin/show
# ./client/routes/admin/show/show.html
# ./client/routes/admin/show/show.js

yo meteor-poetic component admin/show
# ./client/components/admin/show/show.html
# ./client/components/admin/show/show.js

yo meteor-poetic template-helper image-src
# ./client/template-helpers/image-src.js

yo meteor-poetic schema campaigns
# ./schema/campaigns.js

yo meteor-poetic publication campaigns
# ./server/publications/campaigns.js

yo meteor-poetic factory campaigns
# ./server/factorys/campaigns.js
```

# File Structure:
- clients
  - components:  things not routes, keep it flat
  - packages:    wrapper around plugins(swaiper)
  - stylesheets: css styles
  - routes:      correspond to a route, nested like what the router indicates
  - methods:     client only methods

- collections: each file is for one collection

- server
  - methods: server only methods

- methods: file name is the same as method name
