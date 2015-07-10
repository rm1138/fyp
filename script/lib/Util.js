/*
 * Easing Function, Credit by Gaëtan Renaudeau
 * Retreved from https://gist.github.com/gre/1650294
 * only considering the t value for the range [0, 1] => [0, 1]
 */

define(['class/Box'], function (Box) {
    var Util = {};

    Util.radiansMap = {
        "0": 0,
        "1": 0.017453292519943295,
        "2": 0.03490658503988659,
        "3": 0.05235987755982988,
        "4": 0.06981317007977318,
        "5": 0.08726646259971647,
        "6": 0.10471975511965977,
        "7": 0.12217304763960307,
        "8": 0.13962634015954636,
        "9": 0.15707963267948966,
        "10": 0.17453292519943295,
        "11": 0.19198621771937624,
        "12": 0.20943951023931953,
        "13": 0.22689280275926285,
        "14": 0.24434609527920614,
        "15": 0.2617993877991494,
        "16": 0.2792526803190927,
        "17": 0.29670597283903605,
        "18": 0.3141592653589793,
        "19": 0.3316125578789226,
        "20": 0.3490658503988659,
        "21": 0.3665191429188092,
        "22": 0.3839724354387525,
        "23": 0.40142572795869574,
        "24": 0.41887902047863906,
        "25": 0.4363323129985824,
        "26": 0.4537856055185257,
        "27": 0.47123889803846897,
        "28": 0.4886921905584123,
        "29": 0.5061454830783556,
        "30": 0.5235987755982988,
        "31": 0.5410520681182421,
        "32": 0.5585053606381855,
        "33": 0.5759586531581288,
        "34": 0.5934119456780721,
        "35": 0.6108652381980153,
        "36": 0.6283185307179586,
        "37": 0.6457718232379019,
        "38": 0.6632251157578452,
        "39": 0.6806784082777885,
        "40": 0.6981317007977318,
        "41": 0.715584993317675,
        "42": 0.7330382858376184,
        "43": 0.7504915783575616,
        "44": 0.767944870877505,
        "45": 0.7853981633974483,
        "46": 0.8028514559173915,
        "47": 0.8203047484373349,
        "48": 0.8377580409572781,
        "49": 0.8552113334772214,
        "50": 0.8726646259971648,
        "51": 0.890117918517108,
        "52": 0.9075712110370514,
        "53": 0.9250245035569946,
        "54": 0.9424777960769379,
        "55": 0.9599310885968813,
        "56": 0.9773843811168246,
        "57": 0.9948376736367678,
        "58": 1.0122909661567112,
        "59": 1.0297442586766543,
        "60": 1.0471975511965976,
        "61": 1.064650843716541,
        "62": 1.0821041362364843,
        "63": 1.0995574287564276,
        "64": 1.117010721276371,
        "65": 1.1344640137963142,
        "66": 1.1519173063162575,
        "67": 1.1693705988362006,
        "68": 1.1868238913561442,
        "69": 1.2042771838760873,
        "70": 1.2217304763960306,
        "71": 1.239183768915974,
        "72": 1.2566370614359172,
        "73": 1.2740903539558606,
        "74": 1.2915436464758039,
        "75": 1.3089969389957472,
        "76": 1.3264502315156903,
        "77": 1.3439035240356338,
        "78": 1.361356816555577,
        "79": 1.3788101090755203,
        "80": 1.3962634015954636,
        "81": 1.413716694115407,
        "82": 1.43116998663535,
        "83": 1.4486232791552935,
        "84": 1.4660765716752369,
        "85": 1.4835298641951802,
        "86": 1.5009831567151233,
        "87": 1.5184364492350666,
        "88": 1.53588974175501,
        "89": 1.5533430342749535,
        "90": 1.5707963267948966,
        "91": 1.5882496193148399,
        "92": 1.605702911834783,
        "93": 1.6231562043547263,
        "94": 1.6406094968746698,
        "95": 1.6580627893946132,
        "96": 1.6755160819145563,
        "97": 1.6929693744344996,
        "98": 1.710422666954443,
        "99": 1.7278759594743864,
        "100": 1.7453292519943295,
        "101": 1.7627825445142729,
        "102": 1.780235837034216,
        "103": 1.7976891295541593,
        "104": 1.8151424220741028,
        "105": 1.8325957145940461,
        "106": 1.8500490071139892,
        "107": 1.8675022996339325,
        "108": 1.8849555921538759,
        "109": 1.902408884673819,
        "110": 1.9198621771937625,
        "111": 1.9373154697137058,
        "112": 1.9547687622336491,
        "113": 1.9722220547535922,
        "114": 1.9896753472735356,
        "115": 2.007128639793479,
        "116": 2.0245819323134224,
        "117": 2.0420352248333655,
        "118": 2.0594885173533086,
        "119": 2.076941809873252,
        "120": 2.0943951023931953,
        "121": 2.111848394913139,
        "122": 2.129301687433082,
        "123": 2.1467549799530254,
        "124": 2.1642082724729685,
        "125": 2.1816615649929116,
        "126": 2.199114857512855,
        "127": 2.2165681500327987,
        "128": 2.234021442552742,
        "129": 2.251474735072685,
        "130": 2.2689280275926285,
        "131": 2.286381320112572,
        "132": 2.303834612632515,
        "133": 2.321287905152458,
        "134": 2.3387411976724013,
        "135": 2.356194490192345,
        "136": 2.3736477827122884,
        "137": 2.3911010752322315,
        "138": 2.4085543677521746,
        "139": 2.426007660272118,
        "140": 2.443460952792061,
        "141": 2.4609142453120043,
        "142": 2.478367537831948,
        "143": 2.4958208303518914,
        "144": 2.5132741228718345,
        "145": 2.5307274153917776,
        "146": 2.548180707911721,
        "147": 2.5656340004316647,
        "148": 2.5830872929516078,
        "149": 2.600540585471551,
        "150": 2.6179938779914944,
        "151": 2.6354471705114375,
        "152": 2.6529004630313806,
        "153": 2.670353755551324,
        "154": 2.6878070480712677,
        "155": 2.705260340591211,
        "156": 2.722713633111154,
        "157": 2.740166925631097,
        "158": 2.7576202181510405,
        "159": 2.775073510670984,
        "160": 2.792526803190927,
        "161": 2.8099800957108703,
        "162": 2.827433388230814,
        "163": 2.844886680750757,
        "164": 2.8623399732707,
        "165": 2.8797932657906435,
        "166": 2.897246558310587,
        "167": 2.9146998508305306,
        "168": 2.9321531433504737,
        "169": 2.949606435870417,
        "170": 2.9670597283903604,
        "171": 2.9845130209103035,
        "172": 3.0019663134302466,
        "173": 3.01941960595019,
        "174": 3.036872898470133,
        "175": 3.0543261909900763,
        "176": 3.07177948351002,
        "177": 3.0892327760299634,
        "178": 3.106686068549907,
        "179": 3.12413936106985,
        "180": 3.141592653589793,
        "181": 3.159045946109736,
        "182": 3.1764992386296798,
        "183": 3.193952531149623,
        "184": 3.211405823669566,
        "185": 3.2288591161895095,
        "186": 3.2463124087094526,
        "187": 3.2637657012293966,
        "188": 3.2812189937493397,
        "189": 3.2986722862692828,
        "190": 3.3161255787892263,
        "191": 3.3335788713091694,
        "192": 3.3510321638291125,
        "193": 3.368485456349056,
        "194": 3.385938748868999,
        "195": 3.4033920413889422,
        "196": 3.420845333908886,
        "197": 3.438298626428829,
        "198": 3.455751918948773,
        "199": 3.473205211468716,
        "200": 3.490658503988659,
        "201": 3.5081117965086026,
        "202": 3.5255650890285457,
        "203": 3.543018381548489,
        "204": 3.560471674068432,
        "205": 3.5779249665883754,
        "206": 3.5953782591083185,
        "207": 3.6128315516282616,
        "208": 3.6302848441482056,
        "209": 3.6477381366681487,
        "210": 3.6651914291880923,
        "211": 3.6826447217080354,
        "212": 3.7000980142279785,
        "213": 3.717551306747922,
        "214": 3.735004599267865,
        "215": 3.752457891787808,
        "216": 3.7699111843077517,
        "217": 3.787364476827695,
        "218": 3.804817769347638,
        "219": 3.822271061867582,
        "220": 3.839724354387525,
        "221": 3.8571776469074686,
        "222": 3.8746309394274117,
        "223": 3.8920842319473548,
        "224": 3.9095375244672983,
        "225": 3.9269908169872414,
        "226": 3.9444441095071845,
        "227": 3.9618974020271276,
        "228": 3.979350694547071,
        "229": 3.9968039870670142,
        "230": 4.014257279586958,
        "231": 4.031710572106902,
        "232": 4.049163864626845,
        "233": 4.066617157146788,
        "234": 4.084070449666731,
        "235": 4.101523742186674,
        "236": 4.118977034706617,
        "237": 4.136430327226561,
        "238": 4.153883619746504,
        "239": 4.171336912266447,
        "240": 4.1887902047863905,
        "241": 4.2062434973063345,
        "242": 4.223696789826278,
        "243": 4.241150082346221,
        "244": 4.258603374866164,
        "245": 4.276056667386107,
        "246": 4.293509959906051,
        "247": 4.310963252425994,
        "248": 4.328416544945937,
        "249": 4.34586983746588,
        "250": 4.363323129985823,
        "251": 4.380776422505767,
        "252": 4.39822971502571,
        "253": 4.4156830075456535,
        "254": 4.4331363000655974,
        "255": 4.4505895925855405,
        "256": 4.468042885105484,
        "257": 4.485496177625427,
        "258": 4.50294947014537,
        "259": 4.520402762665313,
        "260": 4.537856055185257,
        "261": 4.5553093477052,
        "262": 4.572762640225144,
        "263": 4.590215932745087,
        "264": 4.60766922526503,
        "265": 4.625122517784973,
        "266": 4.642575810304916,
        "267": 4.6600291028248595,
        "268": 4.677482395344803,
        "269": 4.694935687864747,
        "270": 4.71238898038469,
        "271": 4.729842272904633,
        "272": 4.747295565424577,
        "273": 4.76474885794452,
        "274": 4.782202150464463,
        "275": 4.799655442984406,
        "276": 4.817108735504349,
        "277": 4.834562028024293,
        "278": 4.852015320544236,
        "279": 4.869468613064179,
        "280": 4.886921905584122,
        "281": 4.9043751981040655,
        "282": 4.921828490624009,
        "283": 4.939281783143953,
        "284": 4.956735075663896,
        "285": 4.97418836818384,
        "286": 4.991641660703783,
        "287": 5.009094953223726,
        "288": 5.026548245743669,
        "289": 5.044001538263612,
        "290": 5.061454830783555,
        "291": 5.078908123303498,
        "292": 5.096361415823442,
        "293": 5.113814708343385,
        "294": 5.131268000863329,
        "295": 5.1487212933832724,
        "296": 5.1661745859032155,
        "297": 5.183627878423159,
        "298": 5.201081170943102,
        "299": 5.218534463463045,
        "300": 5.235987755982989,
        "301": 5.253441048502932,
        "302": 5.270894341022875,
        "303": 5.288347633542818,
        "304": 5.305800926062761,
        "305": 5.323254218582705,
        "306": 5.340707511102648,
        "307": 5.358160803622591,
        "308": 5.375614096142535,
        "309": 5.3930673886624785,
        "310": 5.410520681182422,
        "311": 5.427973973702365,
        "312": 5.445427266222308,
        "313": 5.462880558742251,
        "314": 5.480333851262194,
        "315": 5.497787143782138,
        "316": 5.515240436302081,
        "317": 5.532693728822025,
        "318": 5.550147021341968,
        "319": 5.567600313861911,
        "320": 5.585053606381854,
        "321": 5.602506898901797,
        "322": 5.6199601914217405,
        "323": 5.6374134839416845,
        "324": 5.654866776461628,
        "325": 5.672320068981571,
        "326": 5.689773361501514,
        "327": 5.707226654021458,
        "328": 5.7246799465414,
        "329": 5.742133239061344,
        "330": 5.759586531581287,
        "331": 5.777039824101231,
        "332": 5.794493116621174,
        "333": 5.811946409141117,
        "334": 5.829399701661061,
        "335": 5.8468529941810035,
        "336": 5.8643062867009474,
        "337": 5.88175957922089,
        "338": 5.899212871740834,
        "339": 5.916666164260777,
        "340": 5.934119456780721,
        "341": 5.951572749300663,
        "342": 5.969026041820607,
        "343": 5.986479334340551,
        "344": 6.003932626860493,
        "345": 6.021385919380437,
        "346": 6.03883921190038,
        "347": 6.056292504420323,
        "348": 6.073745796940266,
        "349": 6.09119908946021,
        "350": 6.108652381980153,
        "351": 6.126105674500097,
        "352": 6.14355896702004,
        "353": 6.161012259539983,
        "354": 6.178465552059927,
        "355": 6.19591884457987,
        "356": 6.213372137099814,
        "357": 6.230825429619756,
        "358": 6.2482787221397,
        "359": 6.265732014659642,
        "360": 6.283185307179586,
        "-360": -6.283185307179586,
        "-359": -6.265732014659642,
        "-358": -6.2482787221397,
        "-357": -6.230825429619756,
        "-356": -6.213372137099814,
        "-355": -6.19591884457987,
        "-354": -6.178465552059927,
        "-353": -6.161012259539983,
        "-352": -6.14355896702004,
        "-351": -6.126105674500097,
        "-350": -6.108652381980153,
        "-349": -6.09119908946021,
        "-348": -6.073745796940266,
        "-347": -6.056292504420323,
        "-346": -6.03883921190038,
        "-345": -6.021385919380437,
        "-344": -6.003932626860493,
        "-343": -5.986479334340551,
        "-342": -5.969026041820607,
        "-341": -5.951572749300663,
        "-340": -5.934119456780721,
        "-339": -5.916666164260777,
        "-338": -5.899212871740834,
        "-337": -5.88175957922089,
        "-336": -5.8643062867009474,
        "-335": -5.8468529941810035,
        "-334": -5.829399701661061,
        "-333": -5.811946409141117,
        "-332": -5.794493116621174,
        "-331": -5.777039824101231,
        "-330": -5.759586531581287,
        "-329": -5.742133239061344,
        "-328": -5.7246799465414,
        "-327": -5.707226654021458,
        "-326": -5.689773361501514,
        "-325": -5.672320068981571,
        "-324": -5.654866776461628,
        "-323": -5.6374134839416845,
        "-322": -5.6199601914217405,
        "-321": -5.602506898901797,
        "-320": -5.585053606381854,
        "-319": -5.567600313861911,
        "-318": -5.550147021341968,
        "-317": -5.532693728822025,
        "-316": -5.515240436302081,
        "-315": -5.497787143782138,
        "-314": -5.480333851262194,
        "-313": -5.462880558742251,
        "-312": -5.445427266222308,
        "-311": -5.427973973702365,
        "-310": -5.410520681182422,
        "-309": -5.3930673886624785,
        "-308": -5.375614096142535,
        "-307": -5.358160803622591,
        "-306": -5.340707511102648,
        "-305": -5.323254218582705,
        "-304": -5.305800926062761,
        "-303": -5.288347633542818,
        "-302": -5.270894341022875,
        "-301": -5.253441048502932,
        "-300": -5.235987755982989,
        "-299": -5.218534463463045,
        "-298": -5.201081170943102,
        "-297": -5.183627878423159,
        "-296": -5.1661745859032155,
        "-295": -5.1487212933832724,
        "-294": -5.131268000863329,
        "-293": -5.113814708343385,
        "-292": -5.096361415823442,
        "-291": -5.078908123303498,
        "-290": -5.061454830783555,
        "-289": -5.044001538263612,
        "-288": -5.026548245743669,
        "-287": -5.009094953223726,
        "-286": -4.991641660703783,
        "-285": -4.97418836818384,
        "-284": -4.956735075663896,
        "-283": -4.939281783143953,
        "-282": -4.921828490624009,
        "-281": -4.9043751981040655,
        "-280": -4.886921905584122,
        "-279": -4.869468613064179,
        "-278": -4.852015320544236,
        "-277": -4.834562028024293,
        "-276": -4.817108735504349,
        "-275": -4.799655442984406,
        "-274": -4.782202150464463,
        "-273": -4.76474885794452,
        "-272": -4.747295565424577,
        "-271": -4.729842272904633,
        "-270": -4.71238898038469,
        "-269": -4.694935687864747,
        "-268": -4.677482395344803,
        "-267": -4.6600291028248595,
        "-266": -4.642575810304916,
        "-265": -4.625122517784973,
        "-264": -4.60766922526503,
        "-263": -4.590215932745087,
        "-262": -4.572762640225144,
        "-261": -4.5553093477052,
        "-260": -4.537856055185257,
        "-259": -4.520402762665313,
        "-258": -4.50294947014537,
        "-257": -4.485496177625427,
        "-256": -4.468042885105484,
        "-255": -4.4505895925855405,
        "-254": -4.4331363000655974,
        "-253": -4.4156830075456535,
        "-252": -4.39822971502571,
        "-251": -4.380776422505767,
        "-250": -4.363323129985823,
        "-249": -4.34586983746588,
        "-248": -4.328416544945937,
        "-247": -4.310963252425994,
        "-246": -4.293509959906051,
        "-245": -4.276056667386107,
        "-244": -4.258603374866164,
        "-243": -4.241150082346221,
        "-242": -4.223696789826278,
        "-241": -4.2062434973063345,
        "-240": -4.1887902047863905,
        "-239": -4.171336912266447,
        "-238": -4.153883619746504,
        "-237": -4.136430327226561,
        "-236": -4.118977034706617,
        "-235": -4.101523742186674,
        "-234": -4.084070449666731,
        "-233": -4.066617157146788,
        "-232": -4.049163864626845,
        "-231": -4.031710572106902,
        "-230": -4.014257279586958,
        "-229": -3.9968039870670142,
        "-228": -3.979350694547071,
        "-227": -3.9618974020271276,
        "-226": -3.9444441095071845,
        "-225": -3.9269908169872414,
        "-224": -3.9095375244672983,
        "-223": -3.8920842319473548,
        "-222": -3.8746309394274117,
        "-221": -3.8571776469074686,
        "-220": -3.839724354387525,
        "-219": -3.822271061867582,
        "-218": -3.804817769347638,
        "-217": -3.787364476827695,
        "-216": -3.7699111843077517,
        "-215": -3.752457891787808,
        "-214": -3.735004599267865,
        "-213": -3.717551306747922,
        "-212": -3.7000980142279785,
        "-211": -3.6826447217080354,
        "-210": -3.6651914291880923,
        "-209": -3.6477381366681487,
        "-208": -3.6302848441482056,
        "-207": -3.6128315516282616,
        "-206": -3.5953782591083185,
        "-205": -3.5779249665883754,
        "-204": -3.560471674068432,
        "-203": -3.543018381548489,
        "-202": -3.5255650890285457,
        "-201": -3.5081117965086026,
        "-200": -3.490658503988659,
        "-199": -3.473205211468716,
        "-198": -3.455751918948773,
        "-197": -3.438298626428829,
        "-196": -3.420845333908886,
        "-195": -3.4033920413889422,
        "-194": -3.385938748868999,
        "-193": -3.368485456349056,
        "-192": -3.3510321638291125,
        "-191": -3.3335788713091694,
        "-190": -3.3161255787892263,
        "-189": -3.2986722862692828,
        "-188": -3.2812189937493397,
        "-187": -3.2637657012293966,
        "-186": -3.2463124087094526,
        "-185": -3.2288591161895095,
        "-184": -3.211405823669566,
        "-183": -3.193952531149623,
        "-182": -3.1764992386296798,
        "-181": -3.159045946109736,
        "-180": -3.141592653589793,
        "-179": -3.12413936106985,
        "-178": -3.106686068549907,
        "-177": -3.0892327760299634,
        "-176": -3.07177948351002,
        "-175": -3.0543261909900763,
        "-174": -3.036872898470133,
        "-173": -3.01941960595019,
        "-172": -3.0019663134302466,
        "-171": -2.9845130209103035,
        "-170": -2.9670597283903604,
        "-169": -2.949606435870417,
        "-168": -2.9321531433504737,
        "-167": -2.9146998508305306,
        "-166": -2.897246558310587,
        "-165": -2.8797932657906435,
        "-164": -2.8623399732707,
        "-163": -2.844886680750757,
        "-162": -2.827433388230814,
        "-161": -2.8099800957108703,
        "-160": -2.792526803190927,
        "-159": -2.775073510670984,
        "-158": -2.7576202181510405,
        "-157": -2.740166925631097,
        "-156": -2.722713633111154,
        "-155": -2.705260340591211,
        "-154": -2.6878070480712677,
        "-153": -2.670353755551324,
        "-152": -2.6529004630313806,
        "-151": -2.6354471705114375,
        "-150": -2.6179938779914944,
        "-149": -2.600540585471551,
        "-148": -2.5830872929516078,
        "-147": -2.5656340004316647,
        "-146": -2.548180707911721,
        "-145": -2.5307274153917776,
        "-144": -2.5132741228718345,
        "-143": -2.4958208303518914,
        "-142": -2.478367537831948,
        "-141": -2.4609142453120043,
        "-140": -2.443460952792061,
        "-139": -2.426007660272118,
        "-138": -2.4085543677521746,
        "-137": -2.3911010752322315,
        "-136": -2.3736477827122884,
        "-135": -2.356194490192345,
        "-134": -2.3387411976724013,
        "-133": -2.321287905152458,
        "-132": -2.303834612632515,
        "-131": -2.286381320112572,
        "-130": -2.2689280275926285,
        "-129": -2.251474735072685,
        "-128": -2.234021442552742,
        "-127": -2.2165681500327987,
        "-126": -2.199114857512855,
        "-125": -2.1816615649929116,
        "-124": -2.1642082724729685,
        "-123": -2.1467549799530254,
        "-122": -2.129301687433082,
        "-121": -2.111848394913139,
        "-120": -2.0943951023931953,
        "-119": -2.076941809873252,
        "-118": -2.0594885173533086,
        "-117": -2.0420352248333655,
        "-116": -2.0245819323134224,
        "-115": -2.007128639793479,
        "-114": -1.9896753472735356,
        "-113": -1.9722220547535922,
        "-112": -1.9547687622336491,
        "-111": -1.9373154697137058,
        "-110": -1.9198621771937625,
        "-109": -1.902408884673819,
        "-108": -1.8849555921538759,
        "-107": -1.8675022996339325,
        "-106": -1.8500490071139892,
        "-105": -1.8325957145940461,
        "-104": -1.8151424220741028,
        "-103": -1.7976891295541593,
        "-102": -1.780235837034216,
        "-101": -1.7627825445142729,
        "-100": -1.7453292519943295,
        "-99": -1.7278759594743864,
        "-98": -1.710422666954443,
        "-97": -1.6929693744344996,
        "-96": -1.6755160819145563,
        "-95": -1.6580627893946132,
        "-94": -1.6406094968746698,
        "-93": -1.6231562043547263,
        "-92": -1.605702911834783,
        "-91": -1.5882496193148399,
        "-90": -1.5707963267948966,
        "-89": -1.5533430342749535,
        "-88": -1.53588974175501,
        "-87": -1.5184364492350666,
        "-86": -1.5009831567151233,
        "-85": -1.4835298641951802,
        "-84": -1.4660765716752369,
        "-83": -1.4486232791552935,
        "-82": -1.43116998663535,
        "-81": -1.413716694115407,
        "-80": -1.3962634015954636,
        "-79": -1.3788101090755203,
        "-78": -1.361356816555577,
        "-77": -1.3439035240356338,
        "-76": -1.3264502315156903,
        "-75": -1.3089969389957472,
        "-74": -1.2915436464758039,
        "-73": -1.2740903539558606,
        "-72": -1.2566370614359172,
        "-71": -1.239183768915974,
        "-70": -1.2217304763960306,
        "-69": -1.2042771838760873,
        "-68": -1.1868238913561442,
        "-67": -1.1693705988362006,
        "-66": -1.1519173063162575,
        "-65": -1.1344640137963142,
        "-64": -1.117010721276371,
        "-63": -1.0995574287564276,
        "-62": -1.0821041362364843,
        "-61": -1.064650843716541,
        "-60": -1.0471975511965976,
        "-59": -1.0297442586766543,
        "-58": -1.0122909661567112,
        "-57": -0.9948376736367678,
        "-56": -0.9773843811168246,
        "-55": -0.9599310885968813,
        "-54": -0.9424777960769379,
        "-53": -0.9250245035569946,
        "-52": -0.9075712110370514,
        "-51": -0.890117918517108,
        "-50": -0.8726646259971648,
        "-49": -0.8552113334772214,
        "-48": -0.8377580409572781,
        "-47": -0.8203047484373349,
        "-46": -0.8028514559173915,
        "-45": -0.7853981633974483,
        "-44": -0.767944870877505,
        "-43": -0.7504915783575616,
        "-42": -0.7330382858376184,
        "-41": -0.715584993317675,
        "-40": -0.6981317007977318,
        "-39": -0.6806784082777885,
        "-38": -0.6632251157578452,
        "-37": -0.6457718232379019,
        "-36": -0.6283185307179586,
        "-35": -0.6108652381980153,
        "-34": -0.5934119456780721,
        "-33": -0.5759586531581288,
        "-32": -0.5585053606381855,
        "-31": -0.5410520681182421,
        "-30": -0.5235987755982988,
        "-29": -0.5061454830783556,
        "-28": -0.4886921905584123,
        "-27": -0.47123889803846897,
        "-26": -0.4537856055185257,
        "-25": -0.4363323129985824,
        "-24": -0.41887902047863906,
        "-23": -0.40142572795869574,
        "-22": -0.3839724354387525,
        "-21": -0.3665191429188092,
        "-20": -0.3490658503988659,
        "-19": -0.3316125578789226,
        "-18": -0.3141592653589793,
        "-17": -0.29670597283903605,
        "-16": -0.2792526803190927,
        "-15": -0.2617993877991494,
        "-14": -0.24434609527920614,
        "-13": -0.22689280275926285,
        "-12": -0.20943951023931953,
        "-11": -0.19198621771937624,
        "-10": -0.17453292519943295,
        "-9": -0.15707963267948966,
        "-8": -0.13962634015954636,
        "-7": -0.12217304763960307,
        "-6": -0.10471975511965977,
        "-5": -0.08726646259971647,
        "-4": -0.06981317007977318,
        "-3": -0.05235987755982988,
        "-2": -0.03490658503988659,
        "-1": -0.017453292519943295
    };

    Util.ANIMATION_PROP_ARR = ['x', 'y', 'scaleX', 'scaleY', 'orientation', 'opacity'];
    Util.step = 1000 / 60;
    Util.easingArr = [
        "linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint"
    ];
    Util.EasingFunctions = {
        // no easing, no acceleration
        linear: function (t) {
            return t
        },
        // accelerating from zero velocity
        easeInQuad: function (t) {
            return t * t
        },
        // decelerating to zero velocity
        easeOutQuad: function (t) {
            return t * (2 - t)
        },
        // acceleration until halfway, then deceleration
        easeInOutQuad: function (t) {
            return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        },
        // accelerating from zero velocity 
        easeInCubic: function (t) {
            return t * t * t
        },
        // decelerating to zero velocity 
        easeOutCubic: function (t) {
            return (--t) * t * t + 1
        },
        // acceleration until halfway, then deceleration 
        easeInOutCubic: function (t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        },
        // accelerating from zero velocity 
        easeInQuart: function (t) {
            return t * t * t * t
        },
        // decelerating to zero velocity 
        easeOutQuart: function (t) {
            return 1 - (--t) * t * t * t
        },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function (t) {
            return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
        },
        // accelerating from zero velocity
        easeInQuint: function (t) {
            return t * t * t * t * t
        },
        // decelerating to zero velocity
        easeOutQuint: function (t) {
            return 1 + (--t) * t * t * t * t
        },
        // acceleration until halfway, then deceleration 
        easeInOutQuint: function (t) {
            return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
        }
    }

    Util.processAnimation = function (animation, progress, result, ptr) {
        var from = animation.from;
        var to = animation.to;
        var easing = Util.EasingFunctions[animation.easing];
        var keys = Util.ANIMATION_PROP_ARR;
        var i = keys.length;

        while (i--) {
            var key = keys[i];
            if (from[key] !== to[key]) {
                result[ptr.val++] = Util.valueProjection(from[key], to[key], progress, easing);
            } else {
                result[ptr.val++] = (from[key]);
            }
        }
    };

    Util.valueProjection = function (from, to, progress, easing) {
        if (typeof easing === "function") {
            progress = easing(progress);
        }
        return from * (1 - progress) + to * progress;
    };

    Util.processAnimations = function (animations, step) {
        var totalFrames = 0;
        for (var i = 2, count = animations.length; i < count; i += 3) {
            totalFrames += Math.ceil(animations[i] / step);
        }
        var result = new Float32Array(totalFrames);

        var ptr = 0;
        for (var i = 0, count = animations.length; i < count;) {
            var delta = animations[i++];
            var easingIdx = animations[i++];
            var duration = animations[i++];
            var frameCount = Math.ceil(duration / step);
            var easing = Util.easingArr[easingIdx];
            var start = 0;

            var index = 0;
            while (index < frameCount) {
                result[ptr++] = Util.valueProjection(0, delta, start / duration, easing);
                start += step;
                index++;
            }
            if (index !== Math.ceil(duration / step)) {
                debugger;
            }
        }

        return result;
    };


    Util.radians = function (degree) {
        degree = degree % 360;
        return Util.radiansMap[degree];
    }
    Util.degrees = function (radians) {
        return radians * 180 / Math.PI;
    };

    Util.genRandomId = function () {
        return Math.random().toString(36).substr(2, 5);
    }

    Util.getBox = function getBox(obj) {
        var width = Math.abs(obj.width * obj.scaleX * Math.cos(Util.radians(obj.orientation))) + Math.abs(obj.height * obj.scaleY * Math.sin(Util.radians(obj.orientation)));
        var height = Math.abs(obj.width * obj.scaleX * Math.sin(Util.radians(obj.orientation))) + Math.abs(obj.height * obj.scaleY * Math.cos(Util.radians(obj.orientation)))
        var result = new Box(
            Math.floor(obj.x - width / 2),
            Math.floor(obj.y - height / 2),
            Math.ceil(width),
            Math.ceil(height)
        );
        return result;
    }

    Util.isOverlap = function (x1, y1, w1, h1, x2, y2, w2, h2) {
        var result = false;

        if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) {
            result = true;
        }
        return result;
    }

    Util.isOverlapBox = function (object1, object2) {
        return Util.isOverlap(
            object1.x, object1.y, object1.width, object1.height,
            object2.x, object2.y, object2.width, object2.height
        );
    }

    Util.simpleObjectClone = function (obj) {
        var result = {};
        for (var key in obj) {
            result[key] = obj[key];
        }
        return result;
    }
    return Util;
});
