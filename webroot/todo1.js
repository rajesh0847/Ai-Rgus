/*
Client Name | Inv Date | Max | Amount to Debit | Amount | Amount Adj. | Ters | Debit Date | Access | Acc end


Max is max amount - should be LESS than Amount to Debit if not should be in bg-danger
Amount to Debit  = Amount Adj. if null  use Amount
acc - if args write Ai-RGUS else output the field 
Terms Date = Inv Date + trms


at any number of selected row(s) show button [Run ACH]

api_string = {
	{
	ags_billingClID
	amount [=Amount to Debit]
	debData [= invoie date + terms]
	invoice date
	invRef [=invoie number]
	bill_bID
	bill_cID 	
	} 
	....
}
*/

let data = [
    {
        clientID: 500,
        display_name: 'Chic Edge',
        bd_date: '2022-05-03',
        bd_inv_num: 220503002,
        term: 7,
        max: 500,
        acc: 'args',
        aend: 254,
        cID: 'mnbnteu0da',
        bID: 'vwu5ruihz1',
        amount: 772.28,
        amount_adj: null,
        id: 1,
    },
    {
        clientID: 500,
        display_name: 'Nexus Dynamics',
        bd_date: '2022-05-28',
        bd_inv_num: 220528008,
        term: 7,
        max: 500,
        acc: 'args',
        aend: 254,
        cID: '30zbiftcrq',
        bID: 'd0ettdaaic',
        amount: 350.22,
        amount_adj: null,
        id: 2,
    },
    {
        clientID: 500,
        display_name: 'MetaTrail',
        bd_date: '2022-06-28',
        bd_inv_num: 220628007,
        term: 7,
        max: 500,
        acc: 'args',
        aend: 254,
        cID: 'aet2v4uwkx',
        bID: '7k3umqnwg1',
        amount: 314.82,
        amount_adj: null,
        id: 3,
    },
    {
        clientID: 500,
        display_name: 'Infinity Insights',
        bd_date: '2022-07-28',
        bd_inv_num: 220728008,
        term: 7,
        max: 500,
        acc: 'args',
        aend: 254,
        cID: '52uuvqicis',
        bID: 'hmfoi44dlq',
        amount: 467.59,
        amount_adj: null,
        id: 4,
    },
    {
        clientID: 500,
        display_name: 'Precision Solutions',
        bd_date: '2022-08-28',
        bd_inv_num: 220828009,
        term: 7,
        max: 500,
        acc: 'args',
        aend: 254,
        cID: 'tz35vssuw5',
        bID: '00zurgbglh',
        amount: 332.31,
        amount_adj: null,
        id: 5,
    },
    {
        clientID: 500,
        display_name: 'Infinite Horizons',
        bd_date: '2022-09-28',
        bd_inv_num: 220928010,
        term: 7,
        max: 500,
        acc: 'args',
        aend: 254,
        cID: '8vkfaw3sg0',
        bID: '0upb72ezox',
        amount: 349.8,
        amount_adj: null,
        id: 6,
    },
    {
        clientID: 500,
        display_name: 'SkyVault',
        bd_date: '2022-10-28',
        bd_inv_num: 221028008,
        term: 7,
        max: 500,
        acc: 'args',
        aend: 254,
        cID: '3corpcgfgf',
        bID: '8nbi8hpbzz',
        amount: 349.8,
        amount_adj: null,
        id: 7,
    },
    {
        clientID: 500,
        display_name: 'Vertex Insights',
        bd_date: '2022-11-28',
        bd_inv_num: 221128009,
        term: 7,
        max: 500,
        acc: 'args',
        aend: 254,
        cID: 'w0rkc4qna7',
        bID: 'tvrrk7l0ad',
        amount: 349.8,
        amount_adj: null,
        id: 8,
    },
    {
        clientID: 500,
        display_name: 'Peak Solutions',
        bd_date: '2023-01-01',
        bd_inv_num: 230101011,
        term: 7,
        max: 500,
        acc: 'args',
        aend: 254,
        cID: '7zw2ht7u89',
        bID: 'hq6fhnkkml',
        amount: 349.8,
        amount_adj: null,
        id: 9,
    },
    {
        clientID: 500,
        display_name: 'Modern Ventures',
        bd_date: '2023-01-28',
        bd_inv_num: 230128011,
        term: 7,
        max: 500,
        acc: 'args',
        aend: 254,
        cID: 'x86f2363b4',
        bID: '08t86w56qe',
        amount: 349.8,
        amount_adj: null,
        id: 10,
    },
];
