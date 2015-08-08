# Install
```
npm install generator-meteor-poetic
```

# [File structure and the reason behind it](http://chun-yang.github.io/meteor/2015/08/08/how-to-structure-meteor-app.html)

# Usage
Read generators/index.js to have a full list of generators.
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

yo meteor-poetic collection-helpers campaigns
# ./collection-helpers/campaigns.js

yo meteor-poetic collection-helpers campaigns --server
# ./server/collection-helpers/campaigns.js
```
