export type Policy = {
  slug: string;
  title: string;
  date: string;
  category: string;
  html: string;
};

/**
 * Legal policies rendered under `/legal/[slug]`. HTML content is trusted
 * (authored by the BLOK Capital DAO LLC); the page renderer uses
 * `dangerouslySetInnerHTML` and the `.policy-prose` class for typography.
 */
const policies: Record<string, Policy> = {
  "cookie-policy": {
    slug: "cookie-policy",
    title: "Cookie Policy",
    date: "2025-02-18",
    category: "policy",
    html: `<h2 id="1-our-sites">1. Our sites</h2>
<p>This policy applies to the following websites: <a href="https://blokcaptial.io">blokcaptial.io</a> and <a href="https://private.blokcapital.io">private.blokcapital.io</a></p>
<h2 id="2-who-we-are-and-how-to-contact-us">2. Who we are and how to contact us</h2>
<p>The above sites are operated by <strong>BLOK CAPITAL DAO LLC</strong>, a non-profit limited liability company incorporated in the Marshall Islands.</p>
<h2 id="3-by-using-our-site-you-accept-these-terms">3. By using our site you accept these terms</h2>
<p>This cookie policy applies to our websites, and by accessing and continuing to use them, you agree to this policy.</p>
<h2 id="4-we-may-make-changes-to-this-policy">4. We may make changes to this policy</h2>
<p>We update this policy periodically. Please check it regularly to stay informed.</p>
<h2 id="5-what-are-cookies">5. What are cookies?</h2>
<p>A cookie is a small file of letters and numbers stored on your browser when you visit our websites.</p>
<p>We use <strong>strictly necessary cookies</strong>, which are essential for site functionality.</p>
<h2 id="6-how-can-i-control-my-cookies">6. How can I control my cookies?</h2>
<p>You can manage cookies in your web browser settings:</p>
<ul>
<li>Delete all cookies</li>
<li>Block all cookies</li>
<li>Allow all cookies</li>
<li>Block third-party cookies</li>
<li>Clear cookies when closing your browser</li>
</ul>
<h2 id="7-where-to-find-information-about-controlling-cookies">7. Where to find information about controlling cookies</h2>
<p>For browser-specific cookie settings:</p>
<ul>
<li><a href="https://support.microsoft.com/en-us/microsoft-edge">Microsoft Edge</a></li>
<li><a href="https://support.google.com/chrome">Google Chrome</a></li>
<li><a href="https://support.mozilla.org/">Mozilla Firefox</a></li>
<li><a href="https://support.apple.com/">Apple Safari</a></li>
<li><a href="https://www.opera.com/help">Opera</a></li>
</ul>
<p>For more details, visit <a href="https://www.aboutcookies.org/">AboutCookies.org</a> or <a href="https://www.allaboutcookies.org/">AllAboutCookies.org</a>.</p>`,
  },

  "acceptable-use": {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    date: "2023-11-26",
    category: "policy",
    html: `<p><strong>PLEASE READ THE TERMS OF THIS POLICY CAREFULLY BEFORE USING THE SITE</strong></p>
<h2 id="1-whats-in-these-terms">1. What's in these terms?</h2>
<p>1.1 This acceptable use policy sets out the content standards that apply when you access our sites, upload content, link to our sites, or interact with our sites or any other users in any other way.</p>
<p>1.2 These terms of use apply to the following websites: <strong>blokcaptial.io</strong> and <strong>private.blokcapital.io</strong></p>
<h2 id="2-who-we-are-and-how-to-contact-us">2. Who we are and how to contact us</h2>
<p>The above sites are operated by <strong>BLOK CAPITAL DAO LLC</strong>, a non-profit limited liability company (herein referred to as <strong>"We"</strong>) incorporated, with registration number <strong>10050-23</strong>; and, registered address, <strong>PO Box 852, Long Island Rd, Majuro, Marshall Islands MH 96960</strong>, as per the laws of Republic of the Marshall Islands pursuant to the <strong>Limited Liability Company Act of 1996</strong>, the <strong>Marshall Islands Non-Profit Entities (Amendment) Act of 2021</strong>, and the <strong>Marshall Islands Decentralized Autonomous Organization Act of 2023</strong>.</p>
<p><strong>Contact us:</strong> <a href="mailto:support@blokcaptial.io">support@blokcaptial.io</a></p>
<h2 id="3-by-using-our-sites-you-accept-these-terms">3. By using our sites you accept these terms</h2>
<p>3.1 By using our sites, you confirm that you accept the terms of this policy and that you agree to comply with them.<br>
3.2 If you do not agree to these terms, you must not use our sites.<br>
3.3 We recommend that you save a copy of these terms for future reference.</p>
<h2 id="4-other-applicable-terms">4. Other applicable terms</h2>
<p>Our <strong>Website Terms and Conditions</strong> also apply to your use of our site.</p>
<h2 id="5-changes-to-this-policy">5. Changes to this policy</h2>
<p>5.1 We amend these terms from time to time. Please check these terms regularly to ensure you understand the latest version. <strong>Last updated: 26th November 2023</strong>.</p>
<h2 id="6-prohibited-uses">6. Prohibited Uses</h2>
<p>You may not use our sites:</p>
<ul>
<li>In any way that breaches any applicable local, national, or international law.</li>
<li>In any way that is unlawful or fraudulent.</li>
<li>To bully, insult, intimidate, or humiliate any person.</li>
<li>To harm minors in any way.</li>
<li>To transmit viruses, malware, or other harmful code.</li>
<li>To send spam or unsolicited advertising.</li>
<li>To upload terrorist content.</li>
</ul>
<p>You also agree:</p>
<ul>
<li><strong>Not to copy, reproduce, or re-sell</strong> any part of our site.</li>
<li><strong>Not to hack, interfere, or damage</strong> our site or its network.</li>
</ul>
<h2 id="7-content-standards">7. Content Standards</h2>
<p>7.1 These standards apply to any content you upload to our site.<br>
7.2 A Contribution must:<br>
Be accurate (if stating facts).<br>
Be genuinely held (if stating opinions).<br>
Comply with the law.</p>
<p>7.3 A Contribution must <strong>NOT</strong>:<br>
Be defamatory, offensive, or hateful.<br>
Promote illegal activity.<br>
Violate any copyright or intellectual property rights.<br>
Impersonate others or misrepresent information.<br>
Encourage criminal acts or terrorism.<br>
Contain misleading or deceptive information.</p>
<h2 id="8-breach-of-this-policy">8. Breach of this Policy</h2>
<p>If you breach this policy, we may:</p>
<ul>
<li>Suspend or permanently block your access.</li>
<li>Remove any content you uploaded.</li>
<li>Take legal action against you.</li>
<li>Report you to law enforcement authorities.</li>
</ul>
<h2 id="9-governing-law">9. Governing Law</h2>
<p>This policy is governed by <strong>Marshall Islands law</strong> and, where applicable, <strong>English and Welsh law</strong>.</p>`,
  },

  "user-agreement": {
    slug: "user-agreement",
    title: "User Agreement",
    date: "2024-02-07",
    category: "policy",
    html: `<p><strong>BLOK CAPITAL DAO PROVIDES BLOCKCHAIN-ORIENTED TOOLS ENABLING CERTAIN ON-CHAIN FUNCTIONALITIES. USING THESE FUNCTIONALITIES (INCLUDING VIA THE INTERFACE, THE WEBSITE OR MOBILE PHONE APP) POSES SIGNIFICANT RISKS TO YOU AND YOUR DIGITAL ASSETS. THIS DOCUMENT CONTAINS VERY IMPORTANT INFORMATION REGARDING THESE RISKS AND YOUR RIGHTS AND OBLIGATIONS, AS WELL AS CONDITIONS, LIMITATIONS, AND EXCLUSIONS THAT MIGHT APPLY TO YOU AND YOUR RIGHTS. PLEASE READ IT CAREFULLY.</strong></p>
<p><strong>IT SHOULD BE NOTED THAT YOU DO NOT HAVE AN ACCOUNT WITH BLOK CAPITAL DAO AND THAT YOUR ACCOUNT IS DIRECTLY ON THE BLOCKCHAIN. AT NO POINT DOES BLOK CAPITAL DAO HAVE CONTROL OR CUSTODY OF YOUR FUNDS OR CRYPTO ASSETS. WHAT BLOK CAPITAL DAO PROVIDES ARE TOOLS TO MAKE BLOCKCHAIN TRANSACTIONS SIMPLE.</strong></p>
<p><strong>THESE TERMS REQUIRE THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR CLASS ACTIONS.</strong></p>
<p><strong>BY USING THE WEBSITE, THE INTERFACE, OR ANY OF OUR SERVICES, YOU ACCEPT AND ARE BOUND BY THESE TERMS OF USE.</strong></p>
<p><strong>YOU MAY NOT USE OUR WEBSITE, INTERFACE, OR SERVICES IF YOU: (A) DO NOT AGREE TO THESE TERMS; (B) ARE NOT THE OLDER OF: (i) AT LEAST EIGHTEEN (18) YEARS OF AGE OR (ii) LEGAL AGE TO FORM A BINDING CONTRACT; OR (C) ARE PROHIBITED FROM ACCESSING OR USING THE WEBSITE OR SERVICES OR ANY ASSOCIATED FUNCTIONALITIES BY APPLICABLE LAW.</strong></p>
<p><strong>YOU REPRESENT TO US THAT YOU ARE: (1) NOT SUBJECT TO SANCTIONS OR LISTED AS A PROHIBITED OR RESTRICTED PARTY BY AUTHORITIES SUCH AS THE UNITED NATIONS SECURITY COUNCIL, THE UNITED STATES (E.G., THE U.S. DEPARTMENT OF THE TREASURY'S SPECIALLY DESIGNATED NATIONALS LIST OR FOREIGN SANCTIONS EVADERS LIST, OR THE U.S. DEPARTMENT OF COMMERCE'S ENTITY LIST), THE EUROPEAN UNION OR ITS MEMBER STATES, THE UNITED KINGDOM, OR ANY OTHER RELEVANT GOVERNMENT BODY; AND (2) NOT RESIDING IN OR OPERATING FROM A COUNTRY UNDER A COMPREHENSIVE SANCTIONS PROGRAM ENFORCED BY THE UNITED STATES.</strong></p>
<h2 id="1-acceptance-of-the-terms-of-use">1. Acceptance of the Terms of Use</h2>
<p>These Terms of Use are entered into by and between you ("you" or the "User") and BLOK Capital DAO LLC and its affiliates (collectively, the "DAO," "we," "our," or "us"). The following Terms of Use, together with any documents they expressly incorporate by reference (collectively, this "Agreement" or these "Terms of Use"), govern Users' access to and use of our Services (as defined below), which include any protocol software application that we may have a role in providing, whether through our website, blokcapital.io (the "Website"), the website of a third party, through our wallet software application (the "Interface") or through our deployed BLOKC protocol (the "Protocol").</p>
<p>The User must carefully review these Terms of Use before accessing or using the Website, Interface or Protocol. By accessing or using any part of the Website, Interface or Protocol the User acknowledges that they have read, understood, and agree to be bound by these Terms of Use, along with our Privacy Policy, which is incorporated by reference. If the User does not agree to these Terms of Use, the Privacy Policy, or any related documents referenced herein, they must refrain from accessing or using the Website, Interface or Protocol.</p>
<h2 id="2-services-the-interface-blockchain-fees">2. Services; The Interface; Blockchain Fees</h2>
<p>We provide a Protocol that makes it possible for users to:</p>
<p>(i) create an account on the Blockchain;</p>
<p>(ii) link to and interact with certain third-party, on-chain decentralized applications and protocols, including without limitation, decentralized exchanges and other on-chain applications or protocols (Collectively, "Dapp(s)");</p>
<p>(iii) transact with tokens, cryptocurrencies and other blockchain-based ("on-chain") digital assets (collectively, "Digital Assets");</p>
<p>(vi) to group sets of Digital Assets into portfolios which we refer to as a "Gardens";</p>
<p>(v) view addresses and information that are part of on-chain networks and broadcast transaction;</p>
<p>(vi) certain additional functionalities as may be added to the Interface from time to time (collectively, the "Services").</p>
<p>The Protocol is non-custodial, meaning we do not have access to any of the private keys that permit you to access and control the Digital Assets you hold on your account on the Blockchain. We are not, under any circumstances, able to take custody of your Digital Assets or otherwise control your Digital Assets.</p>
<p>The DAO utilizes blockchain technology and therefore is intended to access on-chain software protocols that are provided and operate in a decentralized manner, meaning that The DAO has no ability to control, modify, prevent, stop, amend, or adjust interactions or transactions after they are submitted to each of the relevant blockchain network's nodes or validators, whether or not through the Interface, and that the Interface is not the only method that individuals or parties may interact with, contribute to, access, or otherwise affect the underlying blockchain networks. Consequently, you are expected to be familiar with blockchain technology and the risks it represents (including without limitation the possibility of your Digital Assets being forfeited for any reason) before accessing it (whether or not via the Interface, website or app).</p>
<p><strong>BY USING THE SERVICES AND ANY THIRD-PARTY SERVICES (AS DEFINED BELOW), YOU ACCEPT AND ASSUME ALL RISKS ASSOCIATED WITH POTENTIAL BUGS, ERRORS, VULNERABILITIES, OR EXPLOITS, WHETHER KNOWN OR UNFORESEEN. YOU UNDERSTAND AND AGREE THAT INTERACTING WITH OR USING THE PROTOCOL IS ENTIRELY AT YOUR OWN RISK. BLOK CAPITAL DAO DISCLAIMS ALL LIABILITY OR RESPONSIBILITY AND PROVIDES NO GUARANTEES OR WARRANTIES REGARDING THE SERVICES.</strong></p>
<h2 id="3-prohibited-uses">3. Prohibited Uses</h2>
<p>The User may access or use the Website, the Interface, the Protocol and the Services only for lawful purposes and in accordance with these Terms of Use. The User represents and warrants that the User agrees not to use or access the Website, the Interface, the Protocol or the Services:</p>
<p>In a manner that contravenes any federal, state, local, or international laws or regulations, including but not limited to those addressing anti-money laundering, anti-terrorism financing, anti-proliferation, or the export of data or software to and from restricted countries under applicable laws.</p>
<p>In any way, whether directly or indirectly, intended to cause, result in, or potentially lead to the unlawful stabilization or manipulation of the price of any Digital Assets on blockchain networks or other platforms. This includes, but is not limited to, fungible Digital Assets or non-fungible tokens.</p>
<p>To exploit, harm, or attempt to harm minors in any manner, including by exposing them to inappropriate material, requesting personal information, or through other means.</p>
<p>To distribute or facilitate the distribution of any advertising or promotional content, including but not limited to "junk mail," "chain letters," "spam," or other comparable solicitations. To impersonate or make an attempt to impersonate the DAO, its affiliates, other users, or any individual or entity (for instance, by utilizing email addresses, screen names, similarly spelled or misleading URLs, or related blockchain identities).</p>
<p>To partake in any behavior that interferes with or diminishes others' ability to use or enjoy the Website or Services, or that, in our judgment, could potentially harm the DAO or its Users, or subject them to liability.</p>
<p>If the User is a citizen of or otherwise accessing the Website, the Interface, the Protocol, or the Services from the nations of Cuba, Iran, North Korea, Syria, certain sanctioned areas of Ukraine (including without limitation, the regions of Crimea, Donetsk, and Luhansk), or other countries or geographic regions sanctioned by the United States Department of the Treasury (collectively, "Prohibited Jurisdictions"), or if the User is otherwise listed as a Specially Designated National by the United States Department of the Treasury's Office of Foreign Asset Control ("OFAC").</p>
<p>If doing so is illegal or impermissible according to any Applicable Laws, including without limitation those promulgated by the United Nations Security Council, the United Kingdom, the United States (including those prohibiting dealings with sanctioned persons identified by the OFAC as Specially Designated Nationals and Blocked Persons ("SDN"), or other U.S. non-SDN restricted or prohibited parties lists, and those prohibiting dealings with persons organized, resident, or located in comprehensively sanctioned jurisdictions), and/or any other applicable national, provincial, federal, state, municipal or local laws and regulations (each as amended from time to time).</p>
<p>To cause the Website, the Interface, the Protocol and the Services, any of their underlying blockchain networks or technologies, or any other functionality with which they interact to work other than as intended.</p>
<p>To damage the reputation of the DAO or impair any of the DAO's legal rights or interests.</p>
<h2 id="4-monitoring-enforcement-and-termination">4. Monitoring, Enforcement and Termination</h2>
<p>We reserve the right to pursue suitable legal measures, including but not limited to reporting to law enforcement authorities, in response to any unlawful or unauthorized use of the Website, the Interface, or the Services. Restrict, revoke, or halt your access to some or all parts of the Website, Protocol, the Interface, or the Services at our discretion, including, but not limited to, instances of non-compliance with these Terms of Use.</p>
<h2 id="5-changes-to-the-terms-of-use">5. Changes to the Terms of Use</h2>
<p>We reserve the right to modify or update these Terms of Use at our sole discretion and at any time. Any changes will take effect immediately upon being posted and will apply to all subsequent access and use of the Website. However, updates to the dispute resolution terms outlined in the "Governing Law &amp; Jurisdiction" section will not affect disputes where the parties were already aware of the issue before the changes were published on the Website or Interface.</p>
<p>The User's continued use of the Website, the Interface, Protocol or the Services following the posting of revised Terms of Use means that the User accepts and agrees to the changes. The User is expected to check this page each time it accesses this Website, the Interface, or the Services so it is aware of any changes, as they are binding on the User.</p>
<h2 id="6-warranty-disclaimer">6. Warranty Disclaimer</h2>
<p>The DAO is a builder of software and does not unilaterally offer, operate, or administer any blockchain networks, Digital Assets, or Dapps. The Services merely attempt to assist Users in more easily participating in blockchain networks generally. Nonetheless, the DAO has no oversight on or control over any particular Digital Asset, Dapp, or blockchain network.</p>
<p>The User bears full responsibility for their use of the Services, including the functionalities provided, any transactions conducted through the Website, Protocol, or Interface, and the application of information obtained through these means. It is solely the User's duty to ensure compliance with all Applicable Laws concerning their transactions and activities that involve or relate to the Services we provide. The User also confirms their understanding that the DAO is neither registered nor licensed with any financial or banking authority, nor have our Website, Interface, Protocol, Services, or associated software been subject to regulatory review.</p>
<p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM LIABILITY FOR ANY LOSS OR DAMAGE RESULTING FROM DISTRIBUTED DENIAL-OF-SERVICE ATTACKS, MAN-IN-THE-MIDDLE ATTACKS, VIRUSES, OR OTHER HARMFUL TECHNOLOGICAL ELEMENTS THAT MAY COMPROMISE THE USER'S COMPUTER EQUIPMENT, SOFTWARE, DATA, OR PROPRIETARY MATERIALS.</strong></p>
<h2 id="7-limitation-of-liability">7. Limitation of Liability</h2>
<p><strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEITHER BLOK CAPITAL DAO, ITS AFFILIATES, NOR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS SHALL BE HELD LIABLE FOR ANY DAMAGES OF ANY NATURE.</strong></p>
<p>This includes but is not limited to damages arising under any legal theory connected to the user's use of, or inability to use, the website, interface, Protocol, services, linked websites, or any content contained therein. Such damages include, without limitation, direct, indirect, special, incidental, consequential, or punitive damages.</p>
<p>To the fullest extent allowable under the law, the total liability of BLOK Capital DAO, its affiliates, subsidiaries, and their respective employees, agents, officers, directors, service providers, and licensors, regardless of the form of action (whether contractual, tortious, or otherwise), shall not exceed the greater of $100 or the total amount directly paid by the user to the DAO for relevant service, fees or content within the preceding six months. This does not include deposits of digital assets made into a non-custodial wallet.</p>
<h2 id="8-nature-of-blockchain-assumption-of-risk">8. Nature of Blockchain; Assumption of Risk; Waiver of Claims</h2>
<p>Blockchains, digital assets, wallets, smart accounts, decentralized applications (DApps), Web3 tools, and their associated technologies are still evolving, and they come with significant risks, both foreseeable and unforeseen, spanning security, finance, technology, politics, social issues, and personal safety. Engaging with blockchains demands advanced expertise and knowledge to ensure a reasonable level of safety and effectiveness.</p>
<p>By using or accessing the Website, Interface, Protocol, or Services, the User acknowledges and agrees to the associated risks. The User affirms that they understand these and other risks related to blockchains, Wallets, and related technologies.</p>
<h2 id="9-no-professional-advice">9. No Professional Advice</h2>
<p>The information and content available on the Website (including, but not limited to, the Interface) are intended solely for informational purposes and should not be interpreted as professional advice, such as financial, legal, or tax guidance. Users are advised not to take any action, or refrain from action, based solely on the content or information provided through the Website, Interface, or Services. Instead, they should consult an independent professional who is properly licensed and qualified in the relevant field before making any financial, legal, or other significant decisions.</p>
<h2 id="10-payment-of-tax">10. Payment of Tax</h2>
<p>It is the sole responsibility of the User to determine whether, and to what extent, any taxes apply to any transactions you conduct through the Website, the Protocol, the Interface or the Services, and to withhold, collect, report, and remit the correct amounts of taxes to the appropriate tax authorities.</p>
<h2 id="11-no-fiduciary-duties">11. No Fiduciary Duties</h2>
<p>These Terms of Use, as well as the provision of the Website, the Interface, the Protocol and the Services, are not intended to establish any fiduciary responsibilities between us, the User, or any third party.</p>
<h2 id="12-no-insurance">12. No Insurance</h2>
<p>The funds stored in the User's blockchain account are not equivalent to a cheque or savings accounts, and we do not offer any insurance against potential losses. These losses may include, but are not limited to, a decline in asset value, cybersecurity breaches, or errors and misconduct by you or others.</p>
<h2 id="13-indemnification">13. Indemnification</h2>
<p>The User agrees to defend, indemnify, and hold harmless the DAO, its affiliates, licensors, service providers, and their respective members, officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from any and all claims, liabilities, damages, judgments, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from or connected to: (1) the User's breach of these Terms of Use; (2) the User's use of the Website, Interface, Protocol or Services; (3) the User's reliance on or use of any information obtained from the Website or Interface; or (4) any third-party access or use of the Website, Interface, or Services facilitated by the User's actions.</p>
<h2 id="14-governing-law">14. Governing Law &amp; Jurisdiction</h2>
<p>All matters relating to the Website, the Interface, the Protocol or the Services, and these Terms of Use, and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the internal laws of The Marshall Islands without giving effect to any choice or conflict of law provision or rule (whether of The Marshall Islands or any other jurisdiction).</p>
<h2 id="15-arbitration">15. Arbitration; Class Arbitration Waiver</h2>
<p>In the event of a dispute between you, the User, and the DAO (each a "Party" and collectively, the "Parties") related to these Terms of Use or the breach thereof, the Parties shall participate in at least one (1) live or teleconferenced mediation session. The Parties agree to participate in mediation in good faith and the Parties agree to share equally in the cost of such mediation.</p>`,
  },
};

export function getPolicy(slug: string): Policy | undefined {
  return policies[slug];
}

export function getAllPolicies(): Policy[] {
  return Object.values(policies);
}

export const policySlugs = Object.keys(policies);
