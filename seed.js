var mongoose = require('mongoose');
var dbConnection = require('./server/db');

var dataItem = [


    {   name: 'Sullivan', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-sullivan-eyeglasses-saltwater-matte-front-1798-a613bd26/1000x500', gender: 'men', categories: 'Saltwater', descHeading: "Sullivan combines smooth, rectangular angles with thin, tapered temples for a look that’s easy on the eyes.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Sullivan', price: 145, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-sullivan-eyeglasses-woodgrain-tortoise-front-1805-d5bbc7a8/1000x500', gender: 'men', categories: 'Woodgrain', descHeading: "Sullivan combines smooth, rectangular angles with thin, tapered temples for a look that’s easy on the eyes.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Winston', price: 120, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-winston-eyeglasses-cognac-tortoise-citron-front-2066-a7fa3e61/1000x500', gender: 'men', categories: 'Cognac Tortoise', descHeading: "The limited-edition Winston frame from our Basso Collection is crafted with a straight browline and bold proportions.", descContent: "It also features an elevated “step” design created by paring away the top acetate layer to reveal contrast acetate below."},
    {   name: 'Winston', price: 120, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/ed814ccac5a6fa5e1714ced174950dac916328e1/1000x500', gender: 'men', categories: 'Lunar Fade', descHeading: "The limited-edition Winston frame from our Basso Collection is crafted with a straight browline and bold proportions.", descContent: "It also features an elevated “step” design created by paring away the top acetate layer to reveal contrast acetate below."},
    {   name: 'Winston', price: 120, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/3f7a8e6c7310ec2859710f970b38e2be8b8d8afa/1000x500', gender: 'men', categories: 'Old Fashion Fade', descHeading: "The limited-edition Winston frame from our Basso Collection is crafted with a straight browline and bold proportions.", descContent: "It also features an elevated “step” design created by paring away the top acetate layer to reveal contrast acetate below."},
    {   name: 'Winston', price: 120, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-winston-eyeglasses-cognac-tortoise-citron-front-2066-a7fa3e61/1000x500', gender: 'men', categories: 'Jet Black', descHeading: "The limited-edition Winston frame from our Basso Collection is crafted with a straight browline and bold proportions.", descContent: "It also features an elevated “step” design created by paring away the top acetate layer to reveal contrast acetate below."},
    {   name: 'Arthur', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/a915daa9adb960ee992e84fa17064cc44d53de2d/1000x500', gender: 'men', categories: 'Green Spruce', descHeading: "Arthur's bold browline, keyhole bridge, and slim temple arms ensure that no encounter leaves you unnoticed.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Arthur', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-arthur-eyeglasses-revolver-black-front-1787-bff28fcd/1000x500', gender: 'men', categories: 'Jet Black', descHeading: "Arthur's bold browline, keyhole bridge, and slim temple arms ensure that no encounter leaves you unnoticed.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Arthur', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/c6b210af8f492d725525eb459e3946c9a612813e/1000x500', gender: 'men', categories: 'Sugar Maple', descHeading: "Arthur's bold browline, keyhole bridge, and slim temple arms ensure that no encounter leaves you unnoticed.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Arthur', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/c93cc7b77d0c9fef5ddef6092c1bdc8d9fc5cf7f/1000x500', gender: 'men', categories: 'Gimlet Tortoise', descHeading: "Arthur's bold browline, keyhole bridge, and slim temple arms ensure that no encounter leaves you unnoticed.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Nedwin', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-nedwin-eyeglasses-blue-sapphire-front-1873-d1ae30d6/1000x500', gender: 'men', categories: 'Blue Sapphire', descHeading: "Nedwin offers a sophisticated, professional look with a slight edge.", descContent: "As part of our limited-edition Half-Decade Collection, Nedwin in Blue Sapphire also features the number 5 on the right temple tip."},
    {   name: 'Nedwin', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-nedwin-eyeglasses-jet-black-crystal-front-102-0c1b5738/1000x500', gender: 'men', categories: 'Blue Sapphire', descHeading: "Nedwin offers a sophisticated, professional look with a slight edge.", descContent: "As part of our limited-edition Half-Decade Collection, Nedwin in Blue Sapphire also features the number 5 on the right temple tip."},
    {   name: 'Nedwin', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-nedwin-eyeglasses-blue-sapphire-front-1873-d1ae30d6/1000x500', gender: 'men', categories: 'Jet Black', descHeading: "Nedwin offers a sophisticated, professional look with a slight edge.", descContent: "As part of our limited-edition Half-Decade Collection, Nedwin in Blue Sapphire also features the number 5 on the right temple tip."},
    {   name: 'Nedwin', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-nedwin-eyeglasses-cedar-tortoise-front-456-cb6f9d3c/1000x500', gender: 'men', categories: 'Cedar Tortoise', descHeading: "Nedwin offers a sophisticated, professional look with a slight edge.", descContent: "As part of our limited-edition Half-Decade Collection, Nedwin in Blue Sapphire also features the number 5 on the right temple tip."},
    {   name: 'Nedwin', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-nedwin-eyeglasses-summer-green-front-975-25b96e24/1000x500', gender: 'men', categories: 'Summer Green', descHeading: "Nedwin offers a sophisticated, professional look with a slight edge.", descContent: "As part of our limited-edition Half-Decade Collection, Nedwin in Blue Sapphire also features the number 5 on the right temple tip."},
    {   name: 'Archie', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-archie-eyeglasses-citron-front-1777-7243ebb7/1000x500', gender: 'men', categories: 'Citron', descHeading: "Archie is a narrow, circular frame with a little bit of edge: see keyhole bridge and dropped end pieces.", descContent:"Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Archie', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-archie-eyeglasses-whiskey-tortoise-front-1775-278b0fa7/1000x500', gender: 'men', categories: 'Whiskey', descHeading: "Archie is a narrow, circular frame with a little bit of edge: see keyhole bridge and dropped end pieces.", descContent:"Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Beckett', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/d16173314c2f46318c53ef45ef243acf0959a1fc/1000x500', gender: 'men', categories: 'Jet Black Matte', descHeading: "Designed for medium sized faces, the bold colors, tapered temple arms, and an impeccably crafted bridge bring our take on the classic square eyeframe to the present.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Beckett', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/16452cd13d9c624308084aaa65c3afaa03902fbd/1000x500', gender: 'men', categories: 'Striped Evergreen', descHeading: "Designed for medium sized faces, the bold colors, tapered temple arms, and an impeccably crafted bridge bring our take on the classic square eyeframe to the present.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Beckett', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/9fe9c7c152aca37ab9163c1bd4a7fe832a12c7fe/1000x500', gender: 'men', categories: 'Striped Chestnut', descHeading: "Designed for medium sized faces, the bold colors, tapered temple arms, and an impeccably crafted bridge bring our take on the classic square eyeframe to the present.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Daisy', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-daisy-eyeglasses-peacock-tortoise-front-1789-a229271e/1000x500', gender: 'women', categories: 'Peacock Tortoise', descHeading: "If you’re searching for a soft, slender frame that still commands a little attention, Daisy might be the one.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Daisy', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-daisy-eyeglasses-striped-molasses-front-1788-cdc2de29/1000x500', gender: 'women', categories: 'Striped Molasses', descHeading: "If you’re searching for a soft, slender frame that still commands a little attention, Daisy might be the one.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Coley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-coley-eyeglasses-crystal-front-1262-8ca4331f/1000x500', gender: 'women', categories: 'Crystal', descHeading: "Coley is circular, slim, and utterly charming.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Coley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-coley-eyeglasses-woodgrain-tortoise-front-1264-5f2bb967/1000x500', gender: 'women', categories: 'Woodgrain', descHeading: "Coley is circular, slim, and utterly charming.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Annette', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-annette-eyeglasses-petal-tortoise-front-1266-3b22329e/1000x500', gender: 'women', categories: 'Petal Tortoise', descHeading: "Annette’s slender silhouette toes the line between playful and professional.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Annette', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-annette-eyeglasses-striped-sassafras-front-1255-489ff2e7/1000x500', gender: 'women', categories: 'Strip', descHeading: "Annette’s slender silhouette toes the line between playful and professional.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Sibley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-sibley-eyeglasses-whiskey-tortoise-matte-front-657-f66a8434/1000x500', gender: 'women', categories: 'Whiskey', descHeading: "Angular with sharp features.", descContent: "Sibley gives others an impression that is simultaneously both academic and hostile takeover-esque."},
    {   name: 'Sibley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-sibley-eyeglasses-catalina-blue-front-505-8a2ac8a9/1000x500', gender: 'women', categories: 'Catalina Blue', descHeading: "Angular with sharp features.", descContent: "Sibley gives others an impression that is simultaneously both academic and hostile takeover-esque."},
    {   name: 'Sibley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-sibley-eyeglasses-revolver-black-front-111-4a1f1852/1000x500', gender: 'women', categories: 'Jet Black', descHeading: "Angular with sharp features.", descContent: "Sibley gives others an impression that is simultaneously both academic and hostile takeover-esque."},
    {   name: 'Sibley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-sibley-eyeglasses-amber-front-213-fcc3fbdf/1000x500', gender: 'women', categories: 'Amber', descHeading: "Angular with sharp features.", descContent: "Sibley gives others an impression that is simultaneously both academic and hostile takeover-esque."},
    {   name: 'Raleigh', price: 145, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/0d4cc0ddb7f71c5b7910df19edeb9f816cb1aa47/1000x500', gender: 'women', categories: 'Jet Silver', descHeading: "Sharp, slender and downright confident.", descContent: "Raleigh’s looks alone are enough to climb any corporate ladder"},
    {   name: 'Raleigh', price: 145, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/0d4cc0ddb7f71c5b7910df19edeb9f816cb1aa47/1000x500', gender: 'women', categories: 'Brushed Bark', descHeading: "Sharp, slender and downright confident.", descContent: "Raleigh’s looks alone are enough to climb any corporate ladder"},
    {   name: 'Sloan', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/9448c893c19674d4823350a996331975dcb87520/1000x500', gender: 'women', categories: 'Rum Cherry', descHeading: "With its strong temple arms, traditional bridge, and ever-so-slightly retro shape, Sloan is ideal for reading the news—or making it.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."},
    {   name: 'Sloan', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/dc79fdc106ea5535aa10fe0342d4fd1d03b7424a/1000x500', gender: 'women', categories: 'Striped Chestnut', descHeading: "With its strong temple arms, traditional bridge, and ever-so-slightly retro shape, Sloan is ideal for reading the news—or making it.", descContent: "Lenses made from polycarbonate, the most impact-resistant material on the market. Offers 100% UV protection, anti-scratch and anti-reflective coating included."}
];

var dataUser = [
    { first_name: 'Harry', last_name:'Potter', email:'harry.potter@yahoo.com', password:'daisy123'},
    { first_name: 'Princess', last_name: 'Money', email:'p.money@money.com'},
    { first_name: 'Wizard', middle_name: 'of', last_name: 'Oz', email: 'oz@emeralcity.com', password: "wizard", admin: true}

];

console.log('welcome to the Seed...');

function addToDb (){

    var Item =  mongoose.model('Item');
    
    for(var a=0, len = dataItem.length; a<len; a++){
        console.log(dataItem[a]);
        Item.create(dataItem[a], function(err, data){
            if (err) throw err;
        });
    }
    console.log('Finished adding Items');

    var User = mongoose.model('User');
    for(var a=0, len = dataUser.length; a<len; a++){
        console.log(dataUser[a]);
        User.create(dataUser[a], function(err, data){
            if(err) throw err;
        });
    }

    var Order = mongoose.model('Order');
    Order.remove({}).exec(function(data, err){ });

    console.log('Finished adding Users');
    return;
};


addToDb();

