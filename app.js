// NEKART PREVIEW — client-side only. Mint is DISABLED: contracts are
// deployed (NEKART 0x3fc442342a5289d10773aE585C6CB3Dc4A37254e, NEKA
// 0xa51CFb48d61f95d361fB1cc715c321B3bA79DEbe), mint is not open yet, and no
// BNB is ever requested. The Agent ID checker is read-only against the
// real SPACE ID registry via public BSC RPC.
(function () {
  'use strict';

  var REGISTRY = '0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F'; // SPACE ID Agent ID
  var NFT = '0x3fc442342a5289d10773aE585C6CB3Dc4A37254e'; // NEKART (deployed)
  var TOKEN = '0xa51CFb48d61f95d361fB1cc715c321B3bA79DEbe'; // NEKA (deployed)
  var RPCS = [
    'https://bsc-dataseed.bnbchain.org',
    'https://bsc-dataseed1.binance.org',
    'https://rpc.ankr.com/bsc'
  ];
  var BNB_USD_DISPLAY = 695; // display estimate only; contract uses live Chainlink
  var BONUS_PER_PAID = 120000; // on-chain

  function $(id) { return document.getElementById(id); }

  // ---- i18n (EN main, JA toggle) ----
  var I18N = {
    en: {
      banner: '⚠ PREVIEW — mint is disabled. Contracts are deployed, mint not open yet. The spec below is now on-chain.',
      navPricing: 'Pricing', navToken: 'Token', navHow: 'How to mint', navFaq: 'FAQ', navMint: 'Mint',
      heroH1: 'The neon samurai of Neo Tokyo.',
      heroTag: 'Minted by agents, not by clicking.',
      heroLede: 'NEKART is a 10,000-piece neon samurai collection on BNB Chain. Your Binance Agentic Wallet mints it for you — first mint free, then the price climbs with every mint in your wallet. Every tier artwork is shown openly — see the collection below.',
      pillAgents: 'Agents only', pillSupply: 'supply', pillPrice: 'per paid mint', pillTiers: '5 tier artworks',
      heroCta: 'See the mint plan', heroCta2: 'Pricing tiers',
      heroNote: 'Preview only. Binance Agentic Wallet + .ai Agent ID only — your agent runs the mint, this page never asks for your keys. No Binance collaboration is claimed.',
      statSupply: 'Total supply', statMax: 'Max per Agent ID wallet', statFree: 'Free mint per wallet', statMinted: 'Minted',
      statNote: 'Contracts are deployed and mint is not open yet, so the counter above is the planned total at zero — it is not a live on-chain reading. Mint opening time: opening soon (TBA, shown in UTC when set).',
      pricingH2: 'Pricing — it climbs with your wallet',
      pricingSub: 'The price depends on how many you have already minted in your wallet, not on the global supply. Pegged in $ via the Chainlink BNB/USD oracle at mint time — the BNB you pay moves with the BNB price, the $ price does not. Overpay is refunded in the same transaction.',
      thMint: 'Your mint #', thPrice: 'Price each', thBnb: '≈ BNB *',
      free: 'FREE',
      pricingNote: '* BNB estimates at $695/BNB — estimates only. The contract reads the live Chainlink BNB/USD price at mint time. A wallet minting all 30 pays $9.29 in total (1 free + 9 × $0.11 + 10 × $0.28 + 10 × $0.55), plus gas. Max 30 per Agent ID wallet, ever.',
      tokenH2: 'NEKA token',
      tokenSub: 'The token below is deployed on-chain: total 2,000,000,000 NEKA, pool 1,160,000,000, treasury 840,000,000. Its full name is still pending — only the symbol NEKA is set.',
      tokenDesc: 'BEP-20 bonus token. Every <b>paid</b> mint accrues <b>120,000 NEKA</b> to the minter — free mints accrue nothing. Claim it any time from the token contract.',
      tokenTotal: 'Total supply', tokenPool: 'Bonus pool', tokenTreasury: 'Treasury', tokenMax: 'Max per wallet',
      tokenWarn: 'Note: the symbol NEKA was already used by the earlier NEKA NFT collection (333 supply, live since 2026-11-04). This new NEKA token is a separate, newly deployed contract — do not confuse the two.',
      tokenAddr: 'Contract: <b>0xa51CFb48d61f95d361fB1cc715c321B3bA79DEbe</b>',
      collH2: 'The collection',
      collSub: 'Five tier designs, shown openly from the start. Which samurai your agent draws is decided on-chain at mint time, from the remaining pool (pseudo-random, not Chainlink VRF) — no one can choose which one you get.',
      tierCommon: 'Common', tierUncommon: 'Uncommon', tierRare: 'Rare', tierEpic: 'Epic', tierLegendary: 'Legendary',
      tier1Name: 'Azure Samurai', tier2Name: 'Emerald Ronin', tier3Name: 'Crimson Shogun', tier4Name: 'Golden Emperor', tier5Name: 'Pink Sakura Samurai',
      tier1Range: 'IDs 1–5,000 · 5,000 samurai', tier2Range: 'IDs 5,001–7,500 · 2,500 samurai', tier3Range: 'IDs 7,501–9,000 · 1,500 samurai', tier4Range: 'IDs 9,001–9,700 · 700 samurai', tier5Range: 'IDs 9,701–10,000 · 300 samurai',
      tier1Alt: 'Azure Samurai — blue-haired chibi samurai with a blue kitsune mask and katana', tier2Alt: 'Emerald Ronin — green-haired chibi samurai with a green kitsune mask and katana', tier3Alt: 'Crimson Shogun — red-haired chibi samurai with a red kitsune mask and flaming katana', tier4Alt: 'Golden Emperor — golden-haired chibi samurai with a gold kitsune mask and katana', tier5Alt: 'Pink Sakura Samurai — pink-haired chibi samurai with a kitsune mask and katana',
      howH2: 'Let your agent mint it.',
      howSub: 'Minting is for Binance Agentic Wallets holding an Agent ID (.ai) only. The contract checks it on-chain. Regular wallets cannot mint.',
      step1H: 'Check your wallet', step1Txt: 'Paste your Agentic Wallet address. The page reads the chain to see if it holds an Agent ID.',
      checkBtn: 'Check Agent ID',
      step2H: 'Hand the prompt to your agent', step2Txt: 'Your agent fetches the ready-made transaction and runs it with the Binance Agentic Wallet skill. No forms, no posts, no voucher.',
      showPrompt: 'Show agent prompt (preview)',
      step3H: 'Receive your samurai', step3Txt: 'Your samurai is drawn at mint time and its artwork is shown right away.',
      promptTitle: 'Hand this prompt to your agent', promptTitle2: '(Binance Agentic Wallet skill). Your agent simulates the transaction first, then executes it. This page never asks for your keys.',
      copyPrompt: 'Copy prompt',
      promptNote: 'Contract address: 0x3fc442342a5289d10773aE585C6CB3Dc4A37254e — mint is still closed. Do not send BNB until mint opens.',
      mintH2: 'Mint — preview only',
      noContract: '0x3fc442342a5289d10773aE585C6CB3Dc4A37254e', mintPreview: 'PREVIEW — disabled',
      mintChain: 'Chain:', mintStandard: 'Standard:', mintContract: 'Contract:', mintMint: 'Mint:',
      badgePlanned: 'PLANNED', badgePreview: 'PREVIEW', badgeDraft: 'DRAFT',
      footTitle: 'NEKART — Preview.',
      foot3: '© 2026 NEKART. Artwork is original to this project. Piggy Agent is a separate project — only its agent-mint concept is followed, never its name, artwork, or contract.',
      heroAlt: 'NEKART artwork — pink-haired chibi samurai with a kitsune mask and katana in neon Tokyo, pagoda, torii gate and sakura under a full moon',
      agentAddrAria: 'Agentic Wallet address', aMinusAria: 'Fewer already minted', aPlusAria: 'More already minted', qMinusAria: 'Fewer', qPlusAria: 'More',
      calcAlready: 'Mints this wallet already has (preview calculator):',
      calcAlreadyHint: '0 = first mint is free',
      calcQty: 'How many more to mint:',
      mintBtn: 'Mint — disabled in preview',
      mintFoot: 'Free mint: <b>1 per Agent ID wallet</b>, token free, gas only. Paid mints: <b>$0.11 / $0.28 / $0.55</b> by wallet count. Buying paid first does not burn your free claim — the first mint is always the free one.',
      rulesH2: 'Honest rules',
      rulesTxt: '• <b>10,000 samurai, never more</b> (supply locked on-chain).<br>• <b>Agents only can mint:</b> the contract checks the SPACE ID Agent ID on-chain.<br>• <b>Price is pegged in $:</b> the BNB amount is read from the Chainlink BNB/USD oracle at mint time; overpay is refunded in the same transaction.<br>• <b>Artwork is shown openly:</b> each token shows its tier artwork from the moment it is minted.<br>• <b>NEKA token:</b> +120,000 NEKA per paid mint, totals locked on-chain (2B total / 1.16B pool / 840M treasury).<br>• Trade freely on marketplaces that list the collection. 5% creator royalty where the marketplace supports it.<br>• NFTs are collectibles; prices can go to zero. Nothing on this page is financial advice.',
      faqH2: 'Questions',
      faq1Q: 'I don\'t have an Agentic Wallet. Can I join?', faq1A: 'You cannot mint, but you can buy samurai on a marketplace once trading opens.',
      faq2Q: 'How do I get an Agent ID?', faq2A: 'Open the Binance Wallet app, set up an Agentic Wallet and claim your .ai Agent ID from the banner.',
      faq3Q: 'Why does the price go up?', faq3A: 'The price is per wallet count: your 1st mint is free, #2–10 are $0.11, #11–20 are $0.28, #21–30 are $0.55. Early minters pay less.',
      faq4Q: 'When does mint open?', faq4A: 'Opening soon — no date is set yet. When it is set, it will be shown in UTC on this page.',
      faq5Q: 'Is the NEKA token live?', faq5A: 'Yes — the token contract is deployed at 0xa51CFb48d61f95d361fB1cc715c321B3bA79DEbe with a 2,000,000,000 total supply. +120,000 NEKA accrues per paid mint once mint opens; claim from the token contract.',
      supportH2: 'Support', supportX: 'Official X:',
      supportTxt: 'Follow the official account for mint updates. Only this handle is official. Note: this X account also posted the earlier NEKA collection (333 supply) — NEKART is a new, separate project.',
      followX: 'Follow on X', postX: 'Post on X',
      foot1: 'Neon samurai for AI agents.',
      foot2: 'PREVIEW ONLY: contracts are deployed (NEKART 0x3fc442342a5289d10773aE585C6CB3Dc4A37254e, NEKA 0xa51CFb48d61f95d361fB1cc715c321B3bA79DEbe), mint is disabled, and Nekart.fun is not live yet. The preview lives at nekart.vercel.app. Supply 10,000, prices pegged in $ via Chainlink BNB/USD. NFTs are collectibles; prices can go to zero. Nothing on this page is financial advice.'
    },
    ja: {
      banner: '⚠ プレビュー — ミントは無効です。コントラクトはデプロイ済みですが、ミントはまだ開始していません。以下の仕様はオンチェーンです。',
      navPricing: '価格', navToken: 'トークン', navHow: 'ミント方法', navFaq: 'FAQ', navMint: 'ミント',
      heroH1: 'ネオ東京のネオン侍。',
      heroTag: 'クリックではなく、エージェントがミントする。',
      heroLede: 'NEKARTはBNBチェーンのネオン侍コレクション10,000体です。Binance Agentic Walletがあなたの代わりにミントします。初回は無料、その後はウォレット内のミント数に応じて価格が上がります。すべてのティアアートワークは最初から公開されています。下のコレクションをご覧ください。',
      pillAgents: 'エージェント限定', pillSupply: '体', pillPrice: '有料ミント1回あたり', pillTiers: '5つのティアアート',
      heroCta: 'ミント計画を見る', heroCta2: '価格ティア',
      heroNote: 'プレビューのみ。Binance Agentic Wallet + .ai Agent ID限定です。エージェントがミントを実行します。このページが秘密鍵を求めることはありません。Binanceとの提携は主張していません。',
      statSupply: '総供給量', statMax: 'Agent IDウォレットあたり最大', statFree: 'ウォレットあたり無料ミント', statMinted: 'ミント済み',
      statNote: 'コントラクトはデプロイ済みですが、ミントはまだ開始していません。そのため、上のカウンターは総数をゼロで表示しています。オンチェーンの読み取り値ではありません。ミント開始時刻：近日公開（未定、決定次第UTCで表示）。',
      pricingH2: '価格 — ウォレットとともに上がる',
      pricingSub: '価格は全体の供給量ではなく、あなたのウォレットがすでにミントした数で決まります。ミント時にChainlink BNB/USDオラクルでドル建てに換算します。BNBでの支払額はBNB価格とともに動きますが、ドル価格は変わりません。過払いは同じトランザクションで返金されます。',
      thMint: 'あなたのミント番号', thPrice: '1回あたりの価格', thBnb: 'BNB換算 *',
      free: '無料',
      pricingNote: '* BNB換算は1BNB=695ドルの目安です。コントラクトはミント時にChainlink BNB/USDのライブ価格を読み取ります。1つのウォレットが30体すべてミントすると合計9.29ドル（1回無料 + 9×0.11ドル + 10×0.28ドル + 10×0.55ドル）+ガス代です。Agent IDウォレットあたり最大30体まで。',
      tokenH2: 'NEKAトークン',
      tokenSub: '以下のトークンはオンチェーンにデプロイ済みです。総量2,000,000,000 NEKA、プール1,160,000,000、トレジャリー840,000,000。正式名称は未定で、シンボルNEKAのみが決まっています。',
      tokenDesc: 'BEP-20ボーナストークン。<b>有料</b>ミント1回につき<b>120,000 NEKA</b>がミンターに付与されます。無料ミントには付きません。トークンコントラクトからいつでも請求できます。',
      tokenTotal: '総供給量', tokenPool: 'ボーナスプール', tokenTreasury: 'トレジャリー', tokenMax: 'ウォレットあたり最大',
      tokenWarn: '注意：シンボルNEKAは以前のNEKA NFTコレクション（333体、2026年11月4日からライブ）でも使われていました。この新しいNEKAトークンは別の新規デプロイ済みコントラクトです。混同しないでください。',
      tokenAddr: 'コントラクト：<b>0xa51CFb48d61f95d361fB1cc715c321B3bA79DEbe</b>',
      collH2: 'コレクション',
      collSub: '全5ティアのアートワークは最初から公開されています。どの侍が当たるかはミント時にオンチェーンで決まります（擬似ランダム、Chainlink VRFではありません）。誰も当たる侍を選ぶことはできません。',
      tierCommon: 'コモン', tierUncommon: 'アンコモン', tierRare: 'レア', tierEpic: 'エピック', tierLegendary: 'レジェンダリー',
      tier1Name: '蒼の侍', tier2Name: '翡翠の浪人', tier3Name: '深紅の将軍', tier4Name: '黄金の皇帝', tier5Name: '桜の侍',
      tier1Range: 'ID 1–5,000 · 5,000体', tier2Range: 'ID 5,001–7,500 · 2,500体', tier3Range: 'ID 7,501–9,000 · 1,500体', tier4Range: 'ID 9,001–9,700 · 700体', tier5Range: 'ID 9,701–10,000 · 300体',
      tier1Alt: '蒼の侍 — 青いキツネの仮面と刀を持った青髪のちび侍', tier2Alt: '翡翠の浪人 — 緑のキツネの仮面と刀を持った緑髪のちび侍', tier3Alt: '深紅の将軍 — 赤いキツネの仮面と燃える刀を持った赤髪のちび侍', tier4Alt: '黄金の皇帝 — 金のキツネの仮面と刀を持った金髪のちび侍', tier5Alt: '桜の侍 — ピンクのキツネの仮面と刀を持ったピンク髪のちび侍',
      howH2: 'エージェントにミントさせよう。',
      howSub: 'ミントはBinance Agentic WalletとAgent ID（.ai）を持つウォレット限定です。コントラクトがオンチェーンで確認します。通常のウォレットではミントできません。',
      step1H: 'ウォレットを確認', step1Txt: 'Agentic Walletのアドレスを貼り付けます。ページがチェーンを読み取り、Agent IDを持っているか確認します。',
      checkBtn: 'Agent IDを確認',
      step2H: 'プロンプトをエージェントに渡す', step2Txt: 'エージェントが用意されたトランザクションを取得し、Binance Agentic Walletスキルで実行します。フォームも投稿もバウチャーも不要です。',
      showPrompt: 'エージェント用プロンプトを表示（プレビュー）',
      step3H: '侍を受け取る', step3Txt: 'あなたの侍はミント時に抽選され、アートワークはすぐに表示されます。',
      promptTitle: 'このプロンプトをエージェントに渡してください', promptTitle2: '（Binance Agentic Walletスキル）。エージェントはまずトランザクションをシミュレーションし、その後実行します。このページが秘密鍵を求めることはありません。',
      copyPrompt: 'プロンプトをコピー',
      promptNote: 'コントラクトアドレス：0x3fc442342a5289d10773aE585C6CB3Dc4A37254e — ミントはまだ開始していません。ミント開始までBNBを送らないでください。',
      mintH2: 'ミント — プレビューのみ',
      noContract: '0x3fc442342a5289d10773aE585C6CB3Dc4A37254e', mintPreview: 'プレビュー — 無効',
      mintChain: 'チェーン：', mintStandard: '規格：', mintContract: 'コントラクト：', mintMint: 'ミント：',
      badgePlanned: '計画中', badgePreview: 'プレビュー', badgeDraft: '草案',
      footTitle: 'NEKART — プレビュー。',
      foot3: '© 2026 NEKART。アートワークはこのプロジェクトのオリジナルです。Piggy Agentは別のプロジェクトであり、そのエージェントミントのコンセプトのみを参考にしています。名前、アートワーク、コントラクトは一切使用していません。',
      heroAlt: 'NEKARTのアートワーク — キツネの仮面と刀を持ったピンク髪のちび侍、ネオンの東京、五重塔、鳥居、桜、満月',
      agentAddrAria: 'Agentic Walletアドレス', aMinusAria: 'ミント済み数を減らす', aPlusAria: 'ミント済み数を増やす', qMinusAria: '減らす', qPlusAria: '増やす',
      calcAlready: 'このウォレットがすでにミントした数（プレビュー計算機）：',
      calcAlreadyHint: '0 = 初回ミントは無料',
      calcQty: '追加でミントする数：',
      mintBtn: 'ミント — プレビューでは無効',
      mintFoot: '無料ミント：<b>Agent IDウォレットあたり1回</b>、トークン無料、ガス代のみ。有料ミント：ウォレット内の回数により<b>0.11ドル / 0.28ドル / 0.55ドル</b>。有料を先に買っても無料枠は消えません。初回ミントは常に無料です。',
      rulesH2: '正直なルール',
      rulesTxt: '• <b>10,000体の侍、それ以上はなし</b>（供給量はオンチェーンで確定）。<br>• <b>エージェントのみミント可能：</b>コントラクトがSPACE ID Agent IDをオンチェーンで確認します。<br>• <b>価格はドル建て：</b>BNB額はミント時にChainlink BNB/USDオラクルから読み取ります。過払いは同じトランザクションで返金されます。<br>• <b>アートワークは公開されています：</b>各トークンはミント時からティアのアートワークを表示します。<br>• <b>NEKAトークン：</b>有料ミント1回につき+120,000 NEKA、総量はオンチェーンで確定（総量20億 / プール11.6億 / トレジャリー8.4億）。<br>• リストしているマーケットプレイスで自由に取引できます。対応するマーケットプレイスでは5%のクリエイターロイヤリティがあります。<br>• NFTはコレクティブルであり、価格がゼロになることもあります。このページの内容は投資アドバイスではありません。',
      faqH2: 'よくある質問',
      faq1Q: 'Agentic Walletを持っていません。参加できますか？', faq1A: 'ミントはできませんが、取引が始まればマーケットプレイスで侍を買うことができます。',
      faq2Q: 'Agent IDはどうやって取得しますか？', faq2A: 'Binance Walletアプリを開き、Agentic Walletを設定して、バナーから.ai Agent IDを取得してください。',
      faq3Q: 'なぜ価格が上がるのですか？', faq3A: '価格はウォレット内のミント回数で決まります。1回目は無料、2〜10回目は0.11ドル、11〜20回目は0.28ドル、21〜30回目は0.55ドルです。早くミントするほど安くなります。',
      faq4Q: 'ミントはいつ始まりますか？', faq4A: '近日公開 — 日時はまだ決まっていません。決まり次第、このページにUTCで表示します。',
      faq5Q: 'NEKAトークンはライブですか？', faq5A: 'はい。トークンコントラクトは0xa51CFb48d61f95d361fB1cc715c321B3bA79DEbeにデプロイ済みで、総供給量は2,000,000,000です。ミント開始後、有料ミント1回につき120,000 NEKAが付与されます。トークンコントラクトから請求できます。',
      supportH2: 'サポート', supportX: '公式X：',
      supportTxt: 'ミントの最新情報は公式アカウントをフォローしてください。公式はこのハンドルのみです。注意：このXアカウントは以前のNEKAコレクション（333体）も投稿しています。NEKARTは新しい別のプロジェクトです。',
      followX: 'Xでフォロー', postX: 'Xに投稿',
      foot1: 'AIエージェントのためのネオン侍。',
      foot2: 'プレビューのみ：コントラクトはデプロイ済み（NEKART 0x3fc442342a5289d10773aE585C6CB3Dc4A37254e、NEKA 0xa51CFb48d61f95d361fB1cc715c321B3bA79DEbe）、ミントは無効、Nekart.funもまだライブではありません。プレビューはnekart.vercel.appにあります。供給量10,000体、価格はChainlink BNB/USDでドル建て。NFTはコレクティブルであり、価格がゼロになることもあります。このページの内容は投資アドバイスではありません。'
    }
  };

  var lang = 'en';

  function setLang(l) {
    lang = l;
    document.documentElement.lang = l === 'ja' ? 'ja' : 'en';
    var dict = I18N[l];
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var k = els[i].getAttribute('data-i18n');
      if (dict[k] !== undefined) els[i].innerHTML = dict[k];
    }
    var alts = document.querySelectorAll('[data-i18n-alt]');
    for (var j = 0; j < alts.length; j++) {
      var ak = alts[j].getAttribute('data-i18n-alt');
      if (dict[ak] !== undefined) alts[j].setAttribute('alt', dict[ak]);
    }
    var arias = document.querySelectorAll('[data-i18n-aria]');
    for (var k = 0; k < arias.length; k++) {
      var rk = arias[k].getAttribute('data-i18n-aria');
      if (dict[rk] !== undefined) arias[k].setAttribute('aria-label', dict[rk]);
    }
    $('lang-en').classList.toggle('on', l === 'en');
    $('lang-ja').classList.toggle('on', l === 'ja');
    renderTotal();
  }

  $('lang-en').addEventListener('click', function () { setLang('en'); });
  $('lang-ja').addEventListener('click', function () { setLang('ja'); });

  // ---- Tier calculator (mirrors the draft contract tiers) ----
  var already = 0;
  var qty = 1;

  function centsFor(index) {
    if (index <= 1) return 0;
    if (index <= 10) return 11;
    if (index <= 20) return 28;
    return 55;
  }

  function fmtUsd(cents) { return '$' + (cents / 100).toFixed(2); }
  function fmtBnb(usd) { return '~' + (usd / BNB_USD_DISPLAY).toFixed(5) + ' BNB'; }

  function renderTotal() {
    var cents = 0, paid = 0, free = 0;
    for (var i = 0; i < qty; i++) {
      var c = centsFor(already + i + 1);
      cents += c;
      if (c > 0) paid++; else free++;
    }
    var usd = cents / 100;
    $('a-val').textContent = String(already);
    $('q-val').textContent = String(qty);
    var small = lang === 'ja'
      ? (cents === 0 ? '無料 · ガス代のみ。' : fmtBnb(usd) + ' · ガス代別。BNB換算は1BNB=695ドルの目安です。')
      : (cents === 0 ? 'First mint is free · network gas only.' : fmtBnb(usd) + ' · + network gas. BNB at $695/BNB estimate.');
    $('total-line').innerHTML = fmtUsd(cents) + ' total<small>' + small + '</small>';
    var neka = paid * BONUS_PER_PAID;
    $('neka-line').innerHTML = lang === 'ja'
      ? 'NEKAボーナス：<b>' + neka.toLocaleString('en-US') + ' NEKA</b>（有料' + paid + '回分）' + (free > 0 ? ' · 無料' + free + '回分は対象外' : '')
      : 'NEKA bonus: <b>' + neka.toLocaleString('en-US') + ' NEKA</b> for ' + paid + ' paid mint(s)' + (free > 0 ? ' · ' + free + ' free mint(s) earn nothing' : '');
    $('q-hint').textContent = lang === 'ja'
      ? '数量 1–' + (30 - already) + ' · Agent IDウォレットあたり最大30体'
      : 'Quantity 1–' + (30 - already) + ' · Max 30 per Agent ID wallet';
  }

  function clampQty() { if (qty > 30 - already) qty = Math.max(1, 30 - already); }

  $('a-minus').addEventListener('click', function () { if (already > 0) { already--; clampQty(); renderTotal(); } });
  $('a-plus').addEventListener('click', function () { if (already < 29) { already++; clampQty(); renderTotal(); } });
  $('q-minus').addEventListener('click', function () { if (qty > 1) { qty--; renderTotal(); } });
  $('q-plus').addEventListener('click', function () { if (qty < 30 - already) { qty++; renderTotal(); } });

  // ---- Mint button: preview only — responds, never mints ----
  $('mint-btn').addEventListener('click', function () {
    $('mint-notice').innerHTML = lang === 'ja'
      ? '<b>プレビューのみ — ミントはライブではありません。</b>コントラクトはデプロイ済みですが、ミントはまだ開始しておらず、BNBは要求されません。このボタンはオンチェーンで何もしません。'
      : '<b>Preview only — mint is not live.</b> The contract is deployed but mint is not open yet, and no BNB is requested. This button does nothing on-chain.';
  });

  // ---- Agent prompt (preview template, mint closed) ----
  function buildPrompt() {
    var cents = 0;
    for (var i = 0; i < qty; i++) cents += centsFor(already + i + 1);
    return 'Use my Binance Agentic Wallet on BSC (chain 56) to call mint(' + qty + ') on the NEKART contract 0x3fc442342a5289d10773aE585C6CB3Dc4A37254e. My wallet holds a .ai Agent ID and has already minted ' + already + ' (first mint free; then $0.11 / $0.28 / $0.55 by wallet count, pegged via Chainlink BNB/USD). Total for this mint: $' + (cents / 100).toFixed(2) + '. Simulate the transaction first, then execute it. PREVIEW ONLY — mint is closed; do not execute until mint opens.';
  }

  $('show-prompt-btn').addEventListener('click', function () {
    $('mint-prompt').textContent = buildPrompt();
    $('mint-prompt-box').style.display = 'block';
    $('mint-prompt-box').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $('copy-prompt').addEventListener('click', function () {
    var text = $('mint-prompt').textContent;
    function done(ok) { $('copy-prompt').textContent = ok ? (lang === 'ja' ? 'コピーしました ✓' : 'Copied ✓') : (lang === 'ja' ? 'コピーに失敗しました — テキストを手動で選択してください' : 'Copy failed — select the text manually'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { done(document.execCommand('copy')); } catch (e) { done(false); }
      document.body.removeChild(ta);
    }
  });

  // ---- Agent ID check (read-only, no wallet needed) ----
  var SEL_BALANCE = '0x70a08231';

  function decodeUint(hex) {
    if (!hex || hex === '0x') return 0;
    try { return Number(BigInt(hex)); } catch (e) { return NaN; }
  }

  function ethCall(rpc, to, data) {
    return fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to: to, data: data }, 'latest'] })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j.error) throw new Error(j.error.message || 'RPC error');
      return j.result;
    });
  }

  $('agent-check-btn').addEventListener('click', function () {
    var addr = ($('agent-addr').value || '').trim();
    var out = $('agent-check-out');
    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
      out.textContent = lang === 'ja' ? '有効な0xアドレス（40文字の16進数）を入力してください。' : 'Enter a valid 0x address (40 hex characters).';
      return;
    }
    out.textContent = lang === 'ja' ? 'オンチェーンで確認中…' : 'Checking on-chain…';
    var data = SEL_BALANCE + '000000000000000000000000' + addr.slice(2).toLowerCase();
    var chain = Promise.reject(new Error('start'));
    RPCS.forEach(function (rpc) {
      chain = chain.catch(function () { return ethCall(rpc, REGISTRY, data); });
    });
    chain.then(function (res) {
      var bal = decodeUint(res);
      out.textContent = bal > 0
        ? (lang === 'ja' ? '✓ このウォレットはAgent ID（.ai）を持っています — ミント可能です（1回無料 + 有料29回まで）。' : '✓ This wallet holds an Agent ID (.ai) — it can mint (subject to the 1 free + 29 paid limit).')
        : (lang === 'ja' ? '✗ このアドレスにAgent IDが見つかりません — ミントできません。まずBinanceアプリで無料の.ai Agent IDを取得してください。' : '✗ No Agent ID found for this address — it cannot mint. Claim a free .ai Agent ID in the Binance app first.');
    }).catch(function () {
      out.textContent = lang === 'ja' ? 'チェーンを読み取れませんでした — もう一度お試しください。' : 'Could not read the chain right now — please try again.';
    });
  });

  renderTotal();
})();
