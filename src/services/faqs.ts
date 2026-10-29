export type FaqLanguage = "en" | "sw";

export interface FaqText {
  question: string;
  answer: string;
}

export interface FaqModule {
  id: string;
  title: Record<FaqLanguage, string>;
  note?: Record<FaqLanguage, string>;
  items: FaqItem[];
}

export interface FaqItem {
  id: string;
  en: FaqText;
  sw: FaqText;
}

export const FAQ_MODULES: FaqModule[] = [
  {
    id: "module-1",
    title: {
      en: "Module 1 — AGPO Fundamentals and Business Readiness",
      sw: "Moduli 1 — Misingi ya AGPO na Utayari wa Biashara",
    },
    note: {
      en: "Based on original Modules 1 and 2.",
      sw: "Kulingana na Moduli 1 na 2 za awali.",
    },
    items: [
      {
        id: "q1",
        en: {
          question: "What is AGPO?",
          answer:
            "AGPO stands for Access to Government Procurement Opportunities. It is a Government of Kenya affirmative-action programme that helps businesses owned by youth, women, and persons with disabilities participate in public procurement.",
        },
        sw: {
          question: "AGPO ni nini?",
          answer:
            "AGPO inasimama kwa Access to Government Procurement Opportunities, yaani Fursa za Ununuzi wa Serikali. Ni mpango wa hatua chanya wa Serikali ya Kenya unaosaidia biashara zinazomilikiwa na vijana, wanawake, na watu wenye ulemavu kushiriki katika ununuzi wa umma.",
        },
      },
      {
        id: "q2",
        en: {
          question: "How does AGPO help my business?",
          answer:
            "AGPO provides access to reserved government procurement opportunities. It can help your business access new markets, grow, and create employment. You must still identify suitable opportunities, submit compliant bids, and deliver successfully.",
        },
        sw: {
          question: "AGPO inasaidiaje biashara yangu?",
          answer:
            "AGPO hutoa ufikiaji wa fursa za ununuzi wa serikali zilizotengwa. Inaweza kusaidia biashara yako kufikia masoko mapya, kukua, na kuunda ajira. Bado unatakiwa kutambua fursa zinazofaa, kuwasilisha zabuni zinazokidhi masharti, na kuwasilisha kwa mafanikio.",
        },
      },
      {
        id: "q3",
        en: {
          question: "Does an AGPO certificate guarantee a government contract?",
          answer:
            "No. An AGPO certificate enables participation in reserved opportunities. It does not guarantee a contract or financing, and it does not remove the obligation to meet tender requirements.",
        },
        sw: {
          question: "Cheti cha AGPO kinahakikisha kupata mkataba wa serikali?",
          answer:
            "Hapana. Cheti cha AGPO huwezesha kushiriki katika fursa zilizotengwa. Hakiwezi kuhakikisha mkataba au ufadhili, na hakiiondoi wajibu wa kukidhi mahitaji ya zabuni.",
        },
      },
      {
        id: "q4",
        en: {
          question: "Who qualifies for AGPO?",
          answer:
            "AGPO targets legally registered businesses owned by youth, women, and persons with disabilities. As explained in the training, generally at least 70% ownership must belong to the qualifying category, with qualifying individuals exercising management and control. Eligibility applies to the business, not simply to an individual associated with it.",
        },
        sw: {
          question: "Nani anastahili AGPO?",
          answer:
            "AGPO inalenga biashara zilizosajiliwa kihalali zinazomilikiwa na vijana, wanawake, na watu wenye ulemavu. Kama inavyoelezwa katika mafunzo, kwa ujumla angalau asilimia 70 ya umiliki lazima iwe ya kundi linalostahili, huku watu hao wakifanya usimamizi na udhibiti. Ustahiki unahusu biashara, na si mtu binafsi anayehusiana nayo tu.",
        },
      },
      {
        id: "q5",
        en: {
          question: "How do I apply for AGPO registration?",
          answer:
            "Prepare the identification, business registration, ownership, and tax-compliance documents required for your category and business structure. Apply through the official AGPO portal, upload clear supporting documents, and review your information before submission. AGPO registration is free.",
        },
        sw: {
          question: "Ninaombaje usajili wa AGPO?",
          answer:
            "Andaa nyaraka za utambulisho, usajili wa biashara, umiliki, na kuzingatia kodi zinazohitajika kwa kundi lako na muundo wa biashara yako. Omba kupitia lango rasmi la AGPO, pakia nyaraka za usaidizi zilizo wazi, na pitia taarifa zako kabla ya kuwasilisha. Usajili wa AGPO ni bure.",
        },
      },
      {
        id: "q6",
        en: {
          question:
            "What should I prepare before bidding for government contracts?",
          answer:
            "Prepare your business registration documents, applicable tax-compliance records, permits and licences, business bank account, company profile, and supporting financial records. Keep documents valid, accurate, organised, and easy to retrieve.",
        },
        sw: {
          question:
            "Nini niandae kabla ya kuwasilisha zabuni za mikataba ya serikali?",
          answer:
            "Andaa nyaraka za usajili wa biashara, rekodi za kuzingatia kodi zinazohusika, vibali na leseni, akaunti ya benki ya biashara, wasifu wa kampuni, na rekodi za fedha za usaidizi. Weka nyaraka zikiwa halali, sahihi, zimepangwa, na rahisi kuzipata.",
        },
      },
      {
        id: "q7",
        en: {
          question: "Why should I separate business and personal finances?",
          answer:
            "Separate finances make it easier to track income, expenses, and cash flow. A dedicated business account creates a clear transaction history and supports bookkeeping, tax compliance, payment management, and financing applications.",
        },
        sw: {
          question: "Kwa nini nitenganishe fedha za biashara na za kibinafsi?",
          answer:
            "Kutenganisha fedha hurahisisha kufuatilia mapato, matumizi, na mtiririko wa fedha. Akaunti maalum ya biashara huunda historia ya miamala iliyo wazi na kusaidia uwekaji wa hesabu, kuzingatia kodi, usimamizi wa malipo, na maombi ya ufadhili.",
        },
      },
      {
        id: "q8",
        en: {
          question: "What financial records should I understand?",
          answer:
            "Understand your income statement, balance sheet, and cash flow statement. They show business performance, financial position, and cash movements. A profitable business can still experience a cash shortage when customer payments arrive after expenses fall due.",
        },
        sw: {
          question: "Ni rekodi gani za fedha nizielewe?",
          answer:
            "Elewa taarifa yako ya mapato, mizania, na taarifa ya mtiririko wa fedha. Zinaonyesha utendaji wa biashara, hali ya fedha, na mienendo ya fedha. Biashara yenye faida bado inaweza kukumbana na uhaba wa fedha pale malipo ya wateja yanapofika baada ya muda wa kulipa gharama kufika.",
        },
      },
    ],
  },
  {
    id: "module-2",
    title: {
      en: "Module 2 — Public Procurement, Bid Preparation and Tender Documentation",
      sw: "Moduli 2 — Ununuzi wa Umma, Utayarishaji wa Zabuni na Nyaraka za Zabuni",
    },
    note: {
      en: "Based on original Modules 3 and 4.",
      sw: "Kulingana na Moduli 3 na 4 za awali.",
    },
    items: [
      {
        id: "q9",
        en: {
          question: "What is public procurement?",
          answer:
            "Public procurement is the process public institutions use to purchase goods, works, and services. The training explains the governing framework and the principles of fairness, transparency, accountability, competition, and value for money.",
        },
        sw: {
          question: "Ununuzi wa umma ni nini?",
          answer:
            "Ununuzi wa umma ni mchakato ambao taasisi za umma hutumia kununua bidhaa, kazi, na huduma. Mafunzo yanaelezea mfumo unaoongoza na kanuni za haki, uwazi, uwajibikaji, ushindani, na thamani ya fedha.",
        },
      },
      {
        id: "q10",
        en: {
          question: "Which procurement procedures are covered in the training?",
          answer:
            "The training covers open tendering, restricted tendering, requests for quotations, and framework contracts. Understand the procedure being used and follow the instructions for that particular opportunity.",
        },
        sw: {
          question:
            "Ni taratibu gani za ununuzi zinazofundishwa katika mafunzo?",
          answer:
            "Mafunzo yanajumuisha zabuni za wazi, zabuni zilizozuiliwa, maombi ya nukuu za bei, na mikataba ya mfumo. Elewa taratibu inayotumika na ufuate maagizo ya fursa hiyo mahususi.",
        },
      },
      {
        id: "q11",
        en: {
          question: "What should I do before preparing a bid?",
          answer:
            "Read the complete tender document. Identify eligibility conditions, mandatory documents, technical requirements, evaluation criteria, pricing instructions, submission method, and deadlines. Turn these into a preparation checklist.",
        },
        sw: {
          question: "Nifanye nini kabla ya kuandaa zabuni?",
          answer:
            "Soma hati kamili ya zabuni. Tambua masharti ya ustahiki, nyaraka za lazima, mahitaji ya kiufundi, vigezo vya tathmini, maagizo ya bei, njia ya kuwasilisha, na makataa. Yabadilishe kuwa orodha ya ukaguzi wa utayarishaji.",
        },
      },
      {
        id: "q12",
        en: {
          question: "What is a responsive bid?",
          answer:
            "A responsive bid meets the tender’s requirements, includes the necessary documents, follows the instructions, and is submitted before the deadline. A low price cannot make up for missing mandatory documents or failure to meet technical requirements.",
        },
        sw: {
          question: "Zabuni inayokidhi mahitaji ni nini?",
          answer:
            "Zabuni inayokidhi mahitaji hukidhi masharti ya zabuni, inajumuisha nyaraka zinazohitajika, inafuata maagizo, na huwasilishwa kabla ya makataa. Bei ya chini haiwezi kufidia nyaraka za lazima zilizokosekana au kushindwa kukidhi mahitaji ya kiufundi.",
        },
      },
      {
        id: "q13",
        en: {
          question: "What are mandatory requirements?",
          answer:
            "Mandatory requirements are the minimum documents and conditions a bidder must satisfy. They may include registration documents, valid tax compliance, applicable licences, AGPO certification, completed forms, and signed declarations. Use the requirements in the specific tender.",
        },
        sw: {
          question: "Mahitaji ya lazima ni nini?",
          answer:
            "Mahitaji ya lazima ni nyaraka na masharti ya chini kabisa ambayo mzabuni lazima ayakidhi. Yanaweza kujumuisha nyaraka za usajili, kuzingatia kodi kwa uhalali, leseni zinazohusika, cheti cha AGPO, fomu zilizojazwa, na tamko zilizotiwa saini. Tumia mahitaji yaliyo katika zabuni husika.",
        },
      },
      {
        id: "q14",
        en: {
          question: "How do I demonstrate technical capability?",
          answer:
            "Explain how your business will deliver the required goods, works, or services. Provide relevant evidence of experience, personnel, equipment, resources, and methodology where requested. Tailor the response to the assignment instead of relying on a generic company profile.",
        },
        sw: {
          question: "Ninaonyeshaje uwezo wa kiufundi?",
          answer:
            "Eleza jinsi biashara yako itawasilisha bidhaa, kazi, au huduma zinazohitajika. Toa ushahidi unaohusika wa uzoefu, wafanyakazi, vifaa, rasilimali, na mbinu pale inapohitajika. Binafsisha jibu kwa kazi husika badala ya kutegemea wasifu wa kampuni wa jumla.",
        },
      },
      {
        id: "q15",
        en: {
          question: "How should I prepare my financial proposal?",
          answer:
            "Use the required pricing schedule and calculate the actual cost of delivery. Consider materials, labour, transport, applicable taxes, overheads, and other relevant costs. Check calculations, totals, currency, and consistency before submitting.",
        },
        sw: {
          question: "Ninaandaje pendekezo langu la fedha?",
          answer:
            "Tumia ratiba ya bei inayohitajika na hesabu gharama halisi ya uwasilishaji. Zingatia vifaa, kazi, usafirishaji, kodi zinazohusika, gharama za uendeshaji, na gharama nyingine zinazohusika. Kagua hesabu, jumla, sarafu, na uthabiti kabla ya kuwasilisha.",
        },
      },
      {
        id: "q16",
        en: {
          question: "What mistakes can lead to disqualification?",
          answer:
            "Common mistakes include late submission, missing or expired documents, unsigned forms, unsupported technical claims, incorrect pricing, and unreadable or incomplete files. Arrange documents as instructed and complete pagination or serialisation where required.",
        },
        sw: {
          question:
            "Ni makosa gani yanaweza kusababisha kuondolewa kwenye mchakato?",
          answer:
            "Makosa ya kawaida ni pamoja na kuwasilisha kwa kuchelewa, nyaraka zilizokosekana au zilizopitwa na wakati, fomu zisizotiwa saini, madai ya kiufundi yasiyo na ushahidi, bei isiyo sahihi, na faili zisizosomeka au zisizokamilika. Panga nyaraka kama inavyoelekezwa na ukamilishe kuweka namba za kurasa au mfululizo inapohitajika.",
        },
      },
    ],
  },
  {
    id: "module-3",
    title: {
      en: "Module 3 — Digital Government Procurement Using IFMIS and eGP",
      sw: "Moduli 3 — Ununuzi wa Serikali kwa Njia ya Kidijitali Ukitumia IFMIS na eGP",
    },
    note: {
      en: "Based on original Module 5.",
      sw: "Kulingana na Moduli 5 ya awali.",
    },
    items: [
      {
        id: "q17",
        en: {
          question: "What is the difference between IFMIS and eGP?",
          answer:
            "IFMIS supports broader government financial processes, including budgeting, procurement, payments, accounting, and reporting. eGP focuses on conducting procurement electronically, including accessing opportunities and submitting bids.",
        },
        sw: {
          question: "Kuna tofauti gani kati ya IFMIS na eGP?",
          answer:
            "IFMIS husaidia michakato mipana ya fedha za serikali, ikiwemo bajeti, ununuzi, malipo, uhasibu, na utoaji wa ripoti. eGP hulenga kufanya ununuzi kwa njia ya kielektroniki, ikiwemo kufikia fursa na kuwasilisha zabuni.",
        },
      },
      {
        id: "q18",
        en: {
          question:
            "What should I prepare before using electronic procurement systems?",
          answer:
            "Prepare accurate business information, current compliance documents, clear electronic files, reliable internet access, and a suitable device. Keep your supplier profile and contact information updated.",
        },
        sw: {
          question:
            "Nini niandae kabla ya kutumia mifumo ya ununuzi wa kielektroniki?",
          answer:
            "Andaa taarifa sahihi za biashara, nyaraka za sasa za kuzingatia masharti, faili za kielektroniki zilizo wazi, intaneti ya kuaminika, na kifaa kinachofaa. Weka wasifu wako wa msambazaji na taarifa za mawasiliano zikiwa za sasa.",
        },
      },
      {
        id: "q19",
        en: {
          question: "How do I identify suitable procurement opportunities?",
          answer:
            "Monitor official procurement channels regularly. Use available filters to narrow opportunities by business category, procuring entity, location, or other relevant criteria. Check whether you meet the requirements and have the resources to deliver before deciding to bid.",
        },
        sw: {
          question: "Ninatambuaje fursa zinazofaa za ununuzi?",
          answer:
            "Fuatilia njia rasmi za ununuzi mara kwa mara. Tumia vichujio vinavyopatikana kupunguza fursa kwa kundi la biashara, taasisi inayonunua, eneo, au vigezo vingine vinavyohusika. Kagua kama unakidhi mahitaji na una rasilimali za kuwasilisha kabla ya kuamua kuwasilisha zabuni.",
        },
      },
      {
        id: "q20",
        en: {
          question:
            "Is the tender advertisement enough to prepare my response?",
          answer:
            "No. Download and review the complete tender package, including forms, schedules, specifications, and any amendments. The advertisement alone may not contain everything needed for a compliant response.",
        },
        sw: {
          question: "Tangazo la zabuni linatosha kuandaa jibu langu?",
          answer:
            "Hapana. Pakua na pitia kifurushi kamili cha zabuni, ikiwemo fomu, ratiba, vipimo, na marekebisho yoyote. Tangazo peke yake huenda lisijumuishe kila kitu kinachohitajika kwa jibu linalokidhi masharti.",
        },
      },
      {
        id: "q21",
        en: {
          question: "How should I organise my electronic tender documents?",
          answer:
            "Save documents in a clearly named folder for the tender. Use readable files, clear filenames, the required document order, and the specified format. Check page order, signatures, completeness, and file-size requirements before uploading.",
        },
        sw: {
          question: "Ninapangaje nyaraka zangu za zabuni za kielektroniki?",
          answer:
            "Hifadhi nyaraka katika folda iliyopewa jina wazi kwa ajili ya zabuni. Tumia faili zinazosomeka, majina ya faili wazi, mpangilio wa nyaraka unaohitajika, na muundo uliobainishwa. Kagua mpangilio wa kurasa, saini, ukamilifu, na mahitaji ya ukubwa wa faili kabla ya kupakia.",
        },
      },
      {
        id: "q22",
        en: {
          question: "Does uploading documents mean my tender has been submitted?",
          answer:
            "No. Complete the required final submission steps. Check the submission status and save the confirmation or reference provided. Uploading documents or saving a draft is not the same as completing submission.",
        },
        sw: {
          question:
            "Kupakia nyaraka kunamaanisha zabuni yangu imewasilishwa?",
          answer:
            "Hapana. Kamilisha hatua za mwisho za uwasilishaji zinazohitajika. Kagua hali ya uwasilishaji na uhifadhi uthibitisho au kumbukumbu uliyopewa. Kupakia nyaraka au kuhifadhi rasimu si sawa na kukamilisha uwasilishaji.",
        },
      },
      {
        id: "q23",
        en: {
          question:
            "What should I do if I cannot access the system or upload documents?",
          answer:
            "Check your connection, browser, file format, and file size. Follow the troubleshooting steps in the lesson and contact official support if the problem continues. Start early, record errors, and protect your login details when using a shared computer.",
        },
        sw: {
          question:
            "Nifanye nini ikiwa siwezi kufikia mfumo au kupakia nyaraka?",
          answer:
            "Kagua muunganisho wako, kivinjari, muundo wa faili, na ukubwa wa faili. Fuata hatua za kutatua matatizo zilizo katika somo na uwasiliane na usaidizi rasmi ikiwa tatizo linaendelea. Anza mapema, rekodi makosa, na linda taarifa zako za kuingia unapotumia kompyuta inayotumiwa na wengine.",
        },
      },
      {
        id: "q24",
        en: {
          question:
            "What should I do if I believe my tender was rejected unfairly?",
          answer:
            "Record the notification date, review the reason, compare it with the tender requirements and your submission, and preserve the evidence. Seek written clarification and professional advice where necessary. The lesson explains the formal PPARB review route and emphasises that informal clarification should not be assumed to extend the filing deadline.",
        },
        sw: {
          question:
            "Nifanye nini ikiwa naona zabuni yangu ilikataliwa bila haki?",
          answer:
            "Rekodi tarehe ya taarifa, pitia sababu, linganisha na mahitaji ya zabuni pamoja na uwasilishaji wako, na hifadhi ushahidi. Tafuta ufafanuzi kwa maandishi na ushauri wa kitaalamu inapohitajika. Somo linaelezea njia rasmi ya mapitio ya PPARB na linasisitiza kwamba ufafanuzi wa kawaida haupaswi kudhaniwa kuongeza muda wa mwisho wa kuwasilisha malalamiko.",
        },
      },
    ],
  },
  {
    id: "module-4",
    title: {
      en: "Module 4 — Contract Execution, Performance and Procurement Financing",
      sw: "Moduli 4 — Utekelezaji wa Mkataba, Utendaji na Ufadhili wa Ununuzi",
    },
    note: {
      en: "Based on original Modules 6 and 7.",
      sw: "Kulingana na Moduli 6 na 7 za awali.",
    },
    items: [
      {
        id: "q25",
        en: {
          question:
            "Can I start delivery immediately after receiving an award notification?",
          answer:
            "No. An award notification does not by itself authorise delivery. Review its instructions, complete the required contracting steps, obtain a signed contract, and confirm the necessary authorisation before starting.",
        },
        sw: {
          question:
            "Naweza kuanza uwasilishaji mara moja baada ya kupokea taarifa ya tuzo?",
          answer:
            "Hapana. Taarifa ya tuzo yenyewe hairuhusu uwasilishaji. Pitia maagizo yake, kamilisha hatua za mkataba zinazohitajika, pata mkataba uliotiwa saini, na uthibitishe idhini inayohitajika kabla ya kuanza.",
        },
      },
      {
        id: "q26",
        en: {
          question: "What should I check before signing a contract?",
          answer:
            "Review the scope, specifications, quantities, price, delivery schedule, payment terms, responsibilities, and any required guarantees or other conditions. Make sure you understand the obligations and retain a signed copy.",
        },
        sw: {
          question: "Nikague nini kabla ya kutia saini mkataba?",
          answer:
            "Pitia wigo, vipimo, kiasi, bei, ratiba ya uwasilishaji, masharti ya malipo, majukumu, na dhamana au masharti mengine yoyote yanayohitajika. Hakikisha unaelewa wajibu na uhifadhi nakala iliyotiwa saini.",
        },
      },
      {
        id: "q27",
        en: {
          question: "What if I experience difficulties during contract execution?",
          answer:
            "Inform the authorised contract contact early, explain the problem, and propose a practical solution. Document communications and follow the approval process for changes. Do not make significant changes to quantities, specifications, or schedules informally.",
        },
        sw: {
          question:
            "Nifanye nini nikipata matatizo wakati wa utekelezaji wa mkataba?",
          answer:
            "Mjulishe mtu aliyeidhinishwa wa mkataba mapema, eleza tatizo, na pendekeza suluhisho la vitendo. Andika mawasiliano na ufuate mchakato wa idhini kwa mabadiliko. Usifanye mabadiliko makubwa ya kiasi, vipimo, au ratiba kwa njia isiyo rasmi.",
        },
      },
      {
        id: "q28",
        en: {
          question: "What must happen before I request payment?",
          answer:
            "Meet the contract’s delivery and acceptance requirements. Prepare an accurate invoice with the required supporting records, which may include delivery notes, inspection and acceptance documents, completion certificates, and contract or purchase-order references. Submit through the approved channel and keep proof of receipt.",
        },
        sw: {
          question: "Ni nini lazima kitokee kabla ya kuomba malipo?",
          answer:
            "Kidhi mahitaji ya uwasilishaji na ukubalikaji ya mkataba. Andaa ankara sahihi ikiwa na rekodi za usaidizi zinazohitajika, ambazo zinaweza kujumuisha hati za uwasilishaji, nyaraka za ukaguzi na ukubalikaji, vyeti vya kukamilisha, na kumbukumbu za mkataba au agizo la ununuzi. Wasilisha kupitia njia iliyoidhinishwa na uhifadhi uthibitisho wa kupokelewa.",
        },
      },
      {
        id: "q29",
        en: {
          question: "Does AGPO exempt me from every bond or guarantee?",
          answer:
            "No. The training distinguishes between bid bonds, performance bonds, and advance-payment guarantees. Reserved AGPO opportunities generally exempt eligible suppliers from bid bonds, but that should not be treated as an exemption from every guarantee. Check the applicable requirements.",
        },
        sw: {
          question: "AGPO inaniondolea dhamana au uhakikisho wowote?",
          answer:
            "Hapana. Mafunzo yanatofautisha kati ya dhamana ya zabuni, dhamana ya utekelezaji, na dhamana ya malipo ya mapema. Fursa zilizotengwa za AGPO kwa ujumla huwapa wasambazaji wanaostahili msamaha wa dhamana za zabuni, lakini hilo lisichukuliwe kama msamaha wa kila dhamana. Kagua mahitaji yanayohusika.",
        },
      },
      {
        id: "q30",
        en: {
          question:
            "What is the difference between the three guarantees covered in the training?",
          answer:
            "A bid bond protects specified obligations during bidding. A performance bond supports fulfilment of the awarded contract. An advance-payment guarantee protects money advanced before delivery. They serve different purposes and apply at different stages.",
        },
        sw: {
          question: "Kuna tofauti gani kati ya dhamana tatu zinazofundishwa?",
          answer:
            "Dhamana ya zabuni hulinda majukumu maalum wakati wa kuwasilisha zabuni. Dhamana ya utekelezaji husaidia kutimiza mkataba uliotuzwa. Dhamana ya malipo ya mapema hulinda fedha zinazotolewa kabla ya uwasilishaji. Zina malengo tofauti na hutumika katika hatua tofauti.",
        },
      },
      {
        id: "q31",
        en: {
          question:
            "What is the difference between contract financing and invoice discounting?",
          answer:
            "Contract financing provides working capital to execute an awarded contract before payment. Invoice discounting provides access to funds against an eligible approved invoice after delivery and acceptance. Both depend on the financier’s assessment and terms.",
        },
        sw: {
          question:
            "Kuna tofauti gani kati ya ufadhili wa mkataba na upunguzaji wa ankara?",
          answer:
            "Ufadhili wa mkataba hutoa mtaji wa kufanyia kazi ili kutekeleza mkataba uliotuzwa kabla ya malipo. Upunguzaji wa ankara hutoa ufikiaji wa fedha dhidi ya ankara iliyoidhinishwa inayostahili baada ya uwasilishaji na ukubalikaji. Zote zinategemea tathmini na masharti ya mfadhili.",
        },
      },
      {
        id: "q32",
        en: {
          question: "What financing options does the training cover?",
          answer:
            "The training introduces government catalytic funds, including the Youth Enterprise Development Fund, Women Enterprise Fund, and Uwezo Fund, alongside commercial financing options. Assess eligibility, costs, repayment obligations, and the actual funding need. Neither an AGPO certificate nor a contract guarantees financing.",
        },
        sw: {
          question: "Ni chaguzi gani za ufadhili zinazofundishwa?",
          answer:
            "Mafunzo yanatambulisha fedha za kuchochea za serikali, ikiwemo Mfuko wa Maendeleo ya Biashara za Vijana, Mfuko wa Biashara za Wanawake, na Mfuko wa Uwezo, pamoja na chaguzi za ufadhili wa kibiashara. Tathmini ustahiki, gharama, wajibu wa kulipa, na hitaji halisi la fedha. Wala cheti cha AGPO wala mkataba huhakikisha ufadhili.",
        },
      },
    ],
  },
  {
    id: "module-5",
    title: {
      en: "Module 5 — Business Growth, Governance and Sustainability",
      sw: "Moduli 5 — Ukuaji wa Biashara, Utawala na Uendelevu",
    },
    note: {
      en: "Based on original Module 8.",
      sw: "Kulingana na Moduli 8 ya awali.",
    },
    items: [
      {
        id: "q33",
        en: {
          question: "What does good governance mean for a small business?",
          answer:
            "Good governance means having clear responsibilities, sound decision-making, accurate records, accountability, and transparent operations. It helps the business use resources responsibly, comply with obligations, and build trust.",
        },
        sw: {
          question: "Utawala bora unamaanisha nini kwa biashara ndogo?",
          answer:
            "Utawala bora unamaanisha kuwa na majukumu yaliyo wazi, maamuzi yenye busara, rekodi sahihi, uwajibikaji, na shughuli za uwazi. Husaidia biashara kutumia rasilimali kwa uwajibikaji, kutimiza wajibu, na kujenga uaminifu.",
        },
      },
      {
        id: "q34",
        en: {
          question: "How can I plan for business growth?",
          answer:
            "Maintain a practical business plan with clear goals, target customers, operating needs, financial forecasts, and a growth strategy. Review progress regularly and expand in line with your financial and delivery capacity.",
        },
        sw: {
          question: "Ninawezaje kupanga ukuaji wa biashara?",
          answer:
            "Weka mpango wa biashara wa vitendo wenye malengo wazi, wateja walengwa, mahitaji ya uendeshaji, makisio ya fedha, na mkakati wa ukuaji. Pitia maendeleo mara kwa mara na upanue kulingana na uwezo wako wa fedha na uwasilishaji.",
        },
      },
      {
        id: "q35",
        en: {
          question: "How do I build strong customer and stakeholder relationships?",
          answer:
            "Deliver reliably, communicate professionally, honour commitments, and respond promptly to problems. With procuring entities, respect official procedures and communication channels. Build relationships through service and integrity.",
        },
        sw: {
          question:
            "Ninawezaje kujenga mahusiano imara na wateja na washikadau?",
          answer:
            "Wasilisha kwa kuaminika, wasiliana kwa kitaalamu, timiza ahadi, na jibu matatizo haraka. Kwa taasisi zinazonunua, heshimu taratibu rasmi na njia za mawasiliano. Jenga mahusiano kwa huduma na uadilifu.",
        },
      },
      {
        id: "q36",
        en: {
          question: "What business risks should I prepare for?",
          answer:
            "Consider financial, operational, compliance, technology, reputation, and delivery risks. Assess their likelihood and impact, then establish practical controls such as alternative suppliers, equipment maintenance, staff training, backups, and emergency reserves.",
        },
        sw: {
          question: "Ni hatari gani za biashara niziandae?",
          answer:
            "Zingatia hatari za kifedha, kiutendaji, kuzingatia masharti, teknolojia, sifa, na uwasilishaji. Tathmini uwezekano na athari zake, kisha weka udhibiti wa vitendo kama wasambazaji mbadala, matengenezo ya vifaa, mafunzo ya wafanyakazi, nakala rudufu, na akiba ya dharura.",
        },
      },
      {
        id: "q37",
        en: {
          question: "What is a business continuity plan?",
          answer:
            "It is a plan for maintaining critical operations during and after disruption. It should identify emergency contacts, decision responsibilities, backup records, alternative suppliers, communication arrangements, and ways to continue essential services.",
        },
        sw: {
          question: "Mpango wa mwendelezo wa biashara ni nini?",
          answer:
            "Ni mpango wa kudumisha shughuli muhimu wakati wa usumbufu na baada yake. Unapaswa kutambua anwani za dharura, majukumu ya maamuzi, rekodi za nakala rudufu, wasambazaji mbadala, mipango ya mawasiliano, na njia za kuendelea na huduma muhimu.",
        },
      },
      {
        id: "q38",
        en: {
          question: "How can I improve quality and performance?",
          answer:
            "Understand the requirements, monitor work, inspect quality, correct problems, and retain records. After each assignment, review deadlines, costs, customer feedback, and delivery results. Turn the lessons into practical improvements.",
        },
        sw: {
          question: "Ninawezaje kuboresha ubora na utendaji?",
          answer:
            "Elewa mahitaji, fuatilia kazi, kagua ubora, rekebisha matatizo, na hifadhi rekodi. Baada ya kila kazi, pitia makataa, gharama, maoni ya wateja, na matokeo ya uwasilishaji. Geuza masomo kuwa maboresho ya vitendo.",
        },
      },
      {
        id: "q39",
        en: {
          question: "Which digital tools can help my business?",
          answer:
            "The training covers tools for accounting, invoicing, payment tracking, inventory, customer relationships, and document storage. Choose tools that match your needs, budget, and skills. Protect information through strong passwords, controlled access, updates, and backups.",
        },
        sw: {
          question: "Ni zana gani za kidijitali zinaweza kusaidia biashara yangu?",
          answer:
            "Mafunzo yanajumuisha zana za uhasibu, kutoa ankara, kufuatilia malipo, orodha ya bidhaa, mahusiano na wateja, na kuhifadhi nyaraka. Chagua zana zinazolingana na mahitaji, bajeti, na ujuzi wako. Linda taarifa kwa nenosiri imara, udhibiti wa ufikiaji, masasisho, na nakala rudufu.",
        },
      },
      {
        id: "q40",
        en: {
          question:
            "What makes a government contracting business sustainable?",
          answer:
            "Consistent delivery, sound financial management, compliance, integrity, strong relationships, and continuous improvement. Sustainable growth also requires investment in people, systems, quality, and the capacity to adapt.",
        },
        sw: {
          question:
            "Ni nini hufanya biashara ya mikataba ya serikali iwe endelevu?",
          answer:
            "Uwasilishaji thabiti, usimamizi bora wa fedha, kuzingatia masharti, uadilifu, mahusiano imara, na uboreshaji endelevu. Ukuaji endelevu pia unahitaji uwekezaji katika watu, mifumo, ubora, na uwezo wa kubadilika.",
        },
      },
    ],
  },
];

export const FAQ_TOTAL = FAQ_MODULES.reduce(
  (total, module) => total + module.items.length,
  0,
);
