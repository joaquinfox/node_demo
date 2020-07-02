const mongoose = require('mongoose');
const Camp = require('./models/campground');
const Comment = require('./models/comment');
const data = [
  {
    name: 'Camp Boo',
    image:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.ss1kiynZ0EzlxOyBtISy5gHaE0%26pid%3DApi&f=1',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  },
  {
    name: 'Camp SissyPants',
    image:
      'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimages.goodsam.com%2Ftrailerlifedirectory%2Flargefeatured%2F1000x%2Fpho_760000935_08.jpg&f=1&nofb=1',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  },
  {
    name: 'Camp PoisonIvy',
    image:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.outdoorproject.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fodp_header_adaptive%2Fpublic%2Ffeatures%2Fdsc_0389_0.jpg%3Fitok%3DWIqD9nle&f=1&nofb=1',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  },
];

function seedDB() {
  Camp.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('removed campgrounds');
        // add campgrounds
      data.forEach((seed) => {
        Camp.create(seed, (err, camp) => {
          if (err) {
            console.log(err);
          } else {
            console.log('added a campground');
            Comment.create(
              {
                text: 'I love puffins!',
                author: 'Petee',
              },
              function (err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  camp.comments.push(comment);
                  camp.save();
                  console.log('comment created');
                }
              }
            );
          }
        });
      });
    }
  });
}

module.exports = seedDB;
