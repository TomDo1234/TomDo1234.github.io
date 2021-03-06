function clone(obj) {
    let newobj = new obj.constructor();
    for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            if (obj[attr] instanceof Element) {
                newobj[attr] = obj[attr].cloneNode(true);
            }
            else {
                newobj[attr] = obj[attr];
            }
        }
    }
    return newobj;
}

function unionarray(a,b) {
    let c = a.filter(function(y) {
        return b.indexOf(y) === -1;     //} // union of arrays
    });
    return b.concat(c);
}

function flavoradd() {
    $.ajax({
        type: "GET",
        url:'theflavor.xml',
        dataType: "xml" ,
        success: function (xml){
            let thearray = ["Upgrade",upgrades,"Foe",theenemies];
            for (let index = 0;index < thearray.length; index += 2) {
                for (let index1 = 0;index1 < thearray[index + 1].length;index1 ++) {
                    thearray[index + 1][index1].flavor = $(xml).find(thearray[index]).eq(index1).find('flavor').text();
                }
            }
        }
    });
    $(function() {
        levelenemies = a2clone(ogenemies);
        showfoes();
    });
}

function upgradeeffect(x) {
    switch(x) {
        case up1:
            playerbronze.mod += 1;
            break;
        case up2:
            GenericSpearman.Ibonus *= 2;
            up4.ul = true;
            break;
        case up3:
            attackmod.val += 1;
            break;
        case up4:
            GenericSpearman.Ibonus *= 2;
            break;
        case up5:
            GenericSwordsman.Ibonus *= 2;
            up13.ul = true;
            break;
        case up6:
            GenericKnight.Ibonus *= 2;
            up14.ul = true;
            break;
        case up7:
            Ally.armorbonus += 1;
            break;
        case up8:
            Ability.trapdamagexbonus *= 2;
            break;
        case up9:
            trainedbear.Ibonus *= 2;
            up15.ul = true;
            break;
        case up10:
            reanimatedcorpse.Ibonus *= 2;
            up16.ul = true;
            break;
        case up11:
            giant.Ibonus *= 2;
            up17.ul = true;
            break;
        case up12:
            Ability.trapdamagexbonus *= 4;
            break;
        case up13:
            GenericSwordsman.Ibonus *= 2;
            break;
        case up14:
            GenericKnight.Ibonus *= 2;
            break;
        case up15:
            trainedbear.Ibonus *= 2;
            break;
        case up16:
            reanimatedcorpse.Ibonus *= 2;
            break;
        case up17:
            giant.Ibonus *= 2;
            break;
        case up18:
            Ally.xattackbonus *= 2;
            Ally.xhealthbonus *= 2;
            allies.forEach(function(ally) {
               ally.health *= 2;
            });
            break;
        case bup1:
            playersilver.val += 1;
            break;
    }
}

function load(x) {
    let healthtrack = x.Healthbartrack;
    x.Healthbar.appendChild(healthtrack);
    healthtrack.innerHTML =  Math.round(x.health) + "/" + Math.round(x.MHea);
    healthtrack.style.width = Math.floor(x.health / x.MHea * 100).toString() + "%";
}

function encodetext(text) {
    let newtext = '';
    for (let index = 0; index < text.length; index ++ ) {
        newtext += String.fromCharCode(text.charCodeAt(index) + 7);
    }
    return newtext;
}

function decodetext(text) {
    let newtext = '';
    for (let index = 0; index < text.length; index ++ ) {
        newtext += String.fromCharCode(text.charCodeAt(index) - 7);
    }
    return newtext;
}

function exportsave() {
    savegame();
    let text = "";
    for (let i = 0; i < gamestats.length; i++){
        text += localStorage.getItem("Obj" + i);
    }
    text += localStorage.getItem("canupgrade") + ";[-]"; // ";[-]" is to separate it and add it to array for iteration.
    text += localStorage.getItem("upgraded") + ";[-]";
    text += localStorage.getItem("Saved?") + ";[-]";
    text += localStorage.getItem("allies") + ";[-]";
    text += localStorage.getItem("building") + ";[-]";
    text += localStorage.getItem("player") + ";[-]";
    text = encodetext(text);
    let thedate = new Date();
    let file = new Blob([text], {type: "application/octet-binary"});
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(file));
    link.setAttribute("download", player.name + "\xa0\xa0" + thedate.getDate() + "-" +
        (thedate.getMonth() + 1)  + "-" + thedate.getFullYear() + ".txt");
    link.click();
}

function localstorageparse(LS) {
    let parsed = [];
    let entry = '';
    let flag = false;
    for (let index = 0; index < LS.length; index ++ ) {
        entry += LS.charAt(index);
        if (flag === false) {
            if (LS.charAt(index) === '}') {
                parsed.push(entry);
                entry = '';
            }
            if (parsed.length === gamestats.length) {
                flag = true;
            }
        }
        else if (flag === true) {
            if (index + 5 <= LS.length) {
                if (LS.substring(index + 1, index + 5) === ";[-]") {
                    parsed.push(entry);
                    entry = '';
                    index += 4;
                }
            }
        }
    }
    return parsed;
}

function checksave(parsed) {
    let classobjs = [allies,buildings,playerinventory];
    let classobjnames = ["allies","buildings","playerinventory"];
    let foo;
    try {
        for (let index = 0; index < gamestats.length; index ++ ){
            foo = JSON.parse(parsed[index]);
        }
        foo = JSON.parse(parsed[gamestats.length]);
        foo += JSON.parse(parsed[gamestats.length + 1]);
        for (let count = 0; count < classobjs.length; count ++ ) {
            for (let index = 0; index < classobjs[count].length; index++) {
                foo += JSON.parse(localStorage.getItem(classobjnames[count]))[index];
            }
        }
        foo += JSON.parse(localStorage.getItem("player"));
    }
    catch (e) {
        return false;
    }
    if (foo === true) {
        // this is to prevent the unused variable warning on IDE, it is redundant otherwise.
    }
    return true;
}

function importsave(text) {
    let newtext = decodetext(text);
    let parsed = localstorageparse(newtext);
    if (!checksave(parsed)) {
        alert("Invalid Save!");
        return;
    }
    for (let index = 0; index < gamestats.length; index ++ ){
        let y = gamestats[index];
        let obj = JSON.parse(parsed[index]);
        if (y.constructor.name === "Object") {
            for (let attr in y) {
                if (y.hasOwnProperty(attr) && attr[0] !== "_") {
                    y[attr] = obj[attr];
                }
            }
        }
        else {
            Object.getOwnPropertyNames(Object.getPrototypeOf(y)).forEach(function (attr) {
                if (attr !== "constructor") {
                    y[attr] = obj["_" + attr]; // "_" + ... is to add _ in front of the attribute.
                }
            });
        }
    }
    canupgrade = []; // gamestats.length + 2 is the {TRUE}
    upgraded = [];
    JSON.parse(parsed[gamestats.length]).forEach(function (y) {
        upgrades.forEach(function (ups) {
            if (ups.name === y.name) {
                canupgrade.push(ups);
            }
        });
    });
    JSON.parse(parsed[gamestats.length + 1]).forEach(function (y) {
        upgrades.forEach(function (ups) {
            if (ups.name === y.name) {
                upgraded.push(ups);
            }
        });
    });
    let classobjs = [allies,buildings];
    let classobjnames = ["allies","buildings"];
    for (let count = 0; count < classobjs.length; count ++ ) {
        for (let index = 0; index < classobjs[count].length; index++) {
            let y = classobjs[count][index];
            let obj = JSON.parse(localStorage.getItem(classobjnames[count]))[index];
            Object.getOwnPropertyNames(Object.getPrototypeOf(y)).forEach(function (attr) {
                if (attr !== "constructor") {
                    y[attr] = obj["_" + attr]; // "_" + ... is to add _ in front of the attribute.
                }
            });
        }
    }
    let pobj = JSON.parse(localStorage.getItem("player"));
    Object.getOwnPropertyNames(Object.getPrototypeOf(player)).forEach(function (attr) {
        if (attr !== "constructor") {
            player[attr] = pobj["_" + attr]; // "_" + ... is to add _ in front of the attribute.
        }
    });
    showupgrades();
    blacksmith();
    portal();
    $('#entersave').val('');
}

function levelbuildings() {
    switch(currentlevel.val){
        case 1:
            return [MercenaryGuild];
        case 2:
            return [MercenaryGuild,Portal];
        case 3:
            return [MercenaryGuild,Portal,Blacksmith];
        case 4:
            return [MercenaryGuild,Portal,Blacksmith,Spellshop];
        default:
            return [MercenaryGuild,Portal,Blacksmith,Spellshop];
    }
}

function levelupgrades() {
    let x;
    switch(currentlevel.val){
        case 1:
            x = [up1];
            break;
        case 2:
            x = [up1,up2];
            break;
        case 3:
            x = [up1,up2,up3];
            break;
        case 4:
            x = [up1,up2,up3,up4,up5,up6,up7];
            break;
        case 6:
            x = [up1,up2,up3,up4,up5,up6,up7,up8,up9,up10,up11,up12];
            break;
        case 13:
            x = [up1,up2,up3,up4,up5,up6,up7,up8,up9,up10,up11,up12,up18];
            break;
        default:
            x = canupgrade;
    }
    return x.filter(function(y) {
        return upgraded.indexOf(y) === -1;
    });
}

function a2clone(array) {
    let a  = [];
    for (let x = 0;x < array.length; x++) {
        a.push([]);
        for (let y = 0;y < array[x].length; y++) {
            a[a.length-1].push(clone(array[x][y]));
        }
    }
    return a;
}

function countindungeon(name) {
    let num = 0;
    levelenemies[dungeon.val - 1].forEach(function(enem) {
        if (enem.name === name) {
            num += 1;
        }
    });
    return num;
}

function toggleplusminus(x) {
    let y;
    if (x.innerHTML.charAt(x.innerHTML.length - 1) === "+") {
        y = x.innerHTML.slice(0,-1) + "-";
    }
    else if (x.innerHTML.charAt(x.innerHTML.length - 1) === "-") {
        y = x.innerHTML.slice(0,-1) + "+";
    }
    x.innerHTML = y;
}

function toggleonoff(x) {
    let y;
    if (x.innerHTML.slice(x.innerHTML.length - 3,x.innerHTML.length) === " ON") {
        y = x.innerHTML.slice(0,-3) + " OFF";
    }
    else if (x.innerHTML.slice(x.innerHTML.length - 4,x.innerHTML.length) === " OFF") {
        y = x.innerHTML.slice(0,-3) + " ON";
    }
    x.innerHTML = y;
}

function wobble(x,y) {
    if (wobbleon === true) {
        if (y <= 0) {
            x.classList.add("dead");
            setTimeout(function () {
                x.classList.remove("dead");
            }, 600);
        }
        else {
            x.classList.add("wobbling");
            setTimeout(function () {
                x.classList.remove("wobbling");
            }, 600);
        }
    }
}

function levelup(x) {
    switch(x) {
        case 2:
            return [1,1,1];
        case 3:
            return [2,1,0];
        case 4:
            return [2,2,0];
        case 5:
            return [5,3,0,10];
        case 6:
            return [5,1,1,20];
        case 7:
            return [10,6,0,20];
        case 8:
            return [11,4,0,20];
        case 9:
            return [14,9,1,25];
        case 10:
            return [25,10,1,35];
        case 11:
            return [50,12,2,50];
        case 12:
            return [60,16,1,70];
        case 13:
            return [70,20,0,100];
        case 14:
            return [90,22,1,150];
        case 15:
            return [120,15,1,200];
        case 16:
            return [140,20,1,300];
        case 17:
            return [200,30,2,500];
        case 18:
            return [220,42,2,550];
        case 19:
            return [250,57,3,600];
        case 20:
            return [300,73,0,800];
        default:
            return [2,2,0,0];
    }
}

function levelMercs() {
    let array = [];
    switch(MercenaryGuild.Quantity) {
        case 2:
            array = [trainedbear,reanimatedcorpse,giant];
    }
    array.forEach(function(unit) {
       cantrain.push(unit);
    });
}

function xptolevelup(x) {
    switch(x) {
		case 3:
			return 125;
        case 4:
            return 325;
        case 5:
            return 922;
        case 6:
            return 10000;
        case 7:
            return 100001;
        case 8:
            return 500002;
        case 9:
            return 1299999;
        case 10:
            return 2444444;
        case 11:
            return 4000000;
        case 12:
            return 7000001;
        case 13:
            return 13333321;
        case 14:
            return 30000000;
        case 15:
            return 80000001;
        case 16:
            return 142222222;
        case 17:
            return 210000001;
        case 18:
            return 432132111;
        case 19:
            return 700000000;
        case 20:
            return 1261234900;
        default:
            return 42;
    }
}

function debuff(type,x,duration,y) {
    switch(type) {
        case "speed":
            x.speed -= y;
            setTimeout(function(){x.speed += y},duration);
    }
}

function spelltrap(duration,damage,costadd,number,spell) {
    function thedamage() {
        let enemies = levelenemies[number];
        let finaldamage = enemies[0]._intan ? 0 : damage;
        enemies[0].health -= finaldamage * spell.trapnum[number];
        if (dungeon.val - 1 === number && finaldamage > 0) {wobble(enemies[0]._image,enemies[0].health)}
        enemies.forEach(function(e) {
            if (e.health <= 0) {
                e.Loot();
                player.xp += e.xpr;
                MsgLog("1 " + e._name + " died");
                if (dungeon.val - 1 === number) {wobble(enemies[0]._image,e.health)}
                enemies.splice(enemies.indexOf(e),1);
                setTimeout(showfoes,500);
            }
        });
        if (enemies.length === 0) {
            for (let x = 0; x < ogenemies[number].length; x++) {
                let cope = clone(ogenemies[number][x]);
                enemies.push(cope);
            }
        }
        if (spell.trapnum[number] > 0) {
            setTimeout(thedamage,1000);
        }
    }
    spell.mcost += costadd;
    spell.trapnum[number] += 1;
    if (spell.trapnum[number] === 1) {
        thedamage();
    }
    timertrap[number].push(setTimeout(function() {spell._mcost -= costadd;spell.trapnum[number] -= 1},duration));
}

function removetrap(spell,costminus) {
    spell.mcost -= costminus;
    spell.trapnum[dungeon.val - 1] -= 1;
    clearTimeout(timertrap[dungeon.val - 1].pop());
    //line above is interesting... this removes last element of timertrap and clears the timer there at the same time!
}

function poison(thing,dam,dur) {
    let count = 0;
    function poisoning() {
        if (count <= dur/100 && player.health > 0) {
            count += 1;
            thing.health -= dam;
            if (player.health <= 0) {
                dungeon.val = 1;
            }
            setTimeout(poisoning,100);
        }
    }
    poisoning();
}

function flame(things,dam,dur) {
    let count = 0;
    function flaming() {
        if (count <= dur/500 && player.health > 0) {
            count += 1;
            things.forEach(function(thing) {
                thing.health -= dam;
                if (player.health <= 0) {
                    dungeon.val = 1;
                }
                if (thing.health <= 0) {
                    things.splice(things.indexOf(thing),1);
                }
            });
            setTimeout(flaming,500);
        }
    }
    flaming();
}

function keysofvalue(object,value) {
    let a = [];
    Object.keys(object).forEach(function(key) {
       if(object[key] === value) {
            a.push(key);
       }
    });
    return a;
}

function gendungeon(columns,pseed) {
    let cpoints = [0,columns * 8 - 1]; // 0 sets spawn point
    let dict = {};dict[0] = 0;dict[columns * 8 - 1] = 0;
    let i = 0;
    pseed.forEach(function(block) {
        while (i < block[1]) {
            let coord = Math.floor(Math.random() * columns * 8);
            if (cpoints.indexOf(coord) === -1) {
                cpoints.push(coord);
                dict[coord] = block[0];
                i += 1;
            }
        }
        i = 0;
    });
    //let borderblocks = [];
    for (let y = 0;y < 8;y++) {
        for (let x = 0;x < columns;x++) {
            let min = -1;
            let decide = 0;
            cpoints.forEach(function (point) {
                let distance = (x+1 - point % columns) ** 2 + (y - Math.floor(point / columns)) ** 2;
                if (distance < min || min === -1) {  // || min === -1 is there so I don't have to make the initial min infinite
                    min = distance;
                    decide = point;
                }
            });
            currentdungeon[y][x] = dict[decide];
            /*if (cpoints.indexOf(y * columns + x) !== -1) {
                currentdungeon[y][x] = 2;
            }*/
        }
    }
    let a = keysofvalue(dict,0); // this area heurstically creates corridors to connect rooms
    for (let i = 0;i < a.length - 1;i++) {
        let b = parseInt(a[i + 1]) % columns - parseInt(a[i]) % columns;
        for (let x = 0;Math.abs(x) < Math.abs(b);x += Math.sign(b)) {
            currentdungeon[Math.floor(a[i]/columns)][a[i] % columns + x] = 0;
        }
    }
    for (let i = 0;i < a.length - 1;i++) {
        let b = Math.floor(parseInt(a[i + 1]) / columns) - Math.floor(parseInt(a[i]) / columns);
        for (let x = 0;Math.abs(x) < Math.abs(b);x += Math.sign(b)) {
            currentdungeon[Math.floor(a[i]/columns) + x][a[i] % columns] = 0;
        }
    }
    player.xcpos = 0;
    player.ycpos = 0;
    currentdungeon[0][0] = 'P';
    currentdungeon[7][columns - 1] = 'EX';
    setTimeout(function() {
        generatetable(8,columns);
        graphictiles();
    },1); // for some reason it fucks up if there is no delay
}

function generatetable(row,columns) {
    let dungeon = $("#dungeon");
    dungeon.empty();let td2;
    for (let y = 0;y < 8;y++) {
        let tr = document.createElement("TR");
        for (let x = 0;x < columns;x++) {
            let td = document.createElement("TD");
            td.innerText = currentdungeon[y][x];
            tr.appendChild(td);
            if (y===0&&x===0) {
                td2 = td;
            }
        }
        dungeon.append(tr);
    }
}

let dungeondict = {};

dungeondict[0] = [12,[[0,3],[1,3]]];
dungeondict[1] = [12,[[0,3],[1,3]]];

let tiledict = {};

$(function() {
    tiledict['P'] = $('#Playerpic')[0].src;
    tiledict[0] = "img/tiles/0blackroad.jpg";
    tiledict[1] = "img/tiles/1dirtwall.jpg";
    tiledict['EX'] = "img/tiles/EXexit.png";
});

function graphictiles() {
    let dungeon = $("#dungeon");
    for (let y = 0;y < 8;y++) {
        for (let x = 0;x < currentdungeon[0].length;x++) {
            let i = dungeon[0].rows[y].cells[x];
            let pic = document.createElement("IMG");
            pic.src = tiledict[i.innerText];
            pic.classList.add("tileimg");
            $(i).empty();
            i.appendChild(pic);
        }
    }
}
/*
$(document).on('keydown', function(e) {
    let tag = e.target.tagName.toLowerCase();
    if (tag !== 'input' && tag !== 'textarea') {
        let event = e.which;
        if(event === 65 || event === 37 && player.xcpos > 0) { // <-
            if (currentdungeon[player.ycpos][player.xcpos - 1] !== 1) {
                player.xcpos -= 1;
            }
        }
        if(event === 83 || event === 40 && player.ycpos < 7) { // v
            if (currentdungeon[player.ycpos + 1][player.xcpos] !== 1) {
                player.ycpos += 1;
            }
        }
        if(event === 68 || event === 39 && player.xcpos < currentdungeon[0].length - 1) { // ->
            if (currentdungeon[player.ycpos][player.xcpos + 1] !== 1) {
                player.xcpos += 1;
            }
        }
        if(event === 87 || event === 38 && player.ycpos > 0) { // ^
            if (currentdungeon[player.ycpos - 1][player.xcpos] !== 1) {
                player.ycpos -= 1;
            }
        }
        //console.log([player.xcpos,player.ycpos]);
    }
});*/

function astar() {
    let dlength = currentdungeon[0].length;
    let min = -1;
    let coords = [];
    let x = player.xcpos,y = player.ycpos;
    while (currentdungeon[y][x + 1] !== 1 && x < currentdungeon[0].length - 1) {
        x += 1;
    }
    coords.push([x,y]);
    x = player.xcpos;
    while (currentdungeon[y][x - 1] !== 1 && x > 0) {
        x -= 1;
    }
    coords.push([x,y]);
    x = player.xcpos;
    while (currentdungeon[y + 1][x] !== 1 && y < currentdungeon.length - 1) {
        y += 1;
    }
    coords.push([x,y]);
    y = player.ycpos;
    while (currentdungeon[y - 1][x] !== 1 && y > 0) {
        y += 1;
    }
    coords.push([x,y]);
}

function dungeoncrawl() {
    if (typeof player._xcpos === 'undefined' || typeof player._ycpos === 'undefined') {
        return;
    }
    let cpos = [player._xcpos,player._ycpos];
    let pos = [];
    let enemies = [];
    if (cpos[0] > 0) {
        pos.push(currentdungeon[cpos[1]][cpos[0] - 1]);
    }
    if (cpos[0] < currentdungeon[0].length - 1) {
        pos.push(currentdungeon[cpos[1]][cpos[0] + 1]);
    }
    if (cpos[1] > 0) {
        pos.push(currentdungeon[cpos[1] - 1][cpos[0]]);
    }
    if (cpos[1] < 7) {
        pos.push(currentdungeon[cpos[1] + 1][cpos[0]]);
    }
    pos.forEach(function(entity) {
        if (isNaN(entity) && typeof entity !== 'undefined') { //check if it is an integer or not or else construct.name don't work
            if (entity.constructor.name === "Foe") {
                enemies.push(entity);
            }
        }
    });
    fight(setattack,enemies,dungeon.val - 1,allies);
}