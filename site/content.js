/* Lesson content for IELTS Practice Quest.
 * Built from the class materials: Homework 11 Nov, Lecture 2 (Advertising) 12 Nov,
 * Speaking tips slides + Part 1 "Tidiness" recording 18 Nov, Writing tips slides 19 Nov.
 *
 * Activity kinds:
 *   mcq   items: {q, options[], answer: index | [indexes], explain}
 *   fill  items: {q (with ___), answers[], explain}; optional bank[] of tap-to-insert words
 *   sort  rounds: {prompt, buckets[], items: [[text, bucket], ...]}
 *   match rounds: {prompt, left, right, pairs: [[left, right, [also accepted rights]?], ...]}
 *   order rounds: {prompt, slots?[], items[] in the correct order}
 *   speak tasks:  {id, part, question, method, time, prep?, cue?[], targetWords?[], minTarget?}
 *   write tasks:  {id, title, prompt, method, minWords, maxWords, targetWords?[], minTarget?, table?}
 */
window.QUEST = {
  title: "IELTS Practice Quest",
  dates: "Lessons 11–19 Nov",
  units: [
    // ------------------------------------------------------------------ 1
    {
      id: "prep",
      title: "In, on, at",
      subtitle: "Prepositions of time and place",
      source: "Homework · 11 Nov",
      color: "teal",
      activities: [
        {
          id: "prep-homework",
          kind: "mcq",
          title: "Homework check",
          intro: "The 20 homework questions. Choose the right preposition.",
          items: [
            { q: "The meeting starts ___ 9 o'clock.", options: ["in", "on", "at", "by"], answer: 2, explain: "AT + clock times: at 9 o'clock." },
            { q: "We usually go swimming ___ the weekend.", options: ["at", "in", "on", "from"], answer: [0, 2], explain: "British English says at the weekend; American English says on the weekend. Both are correct." },
            { q: "My brother was born ___ 1998.", options: ["on", "at", "in", "by"], answer: 2, explain: "IN + years: in 1998." },
            { q: "She always has breakfast ___ the morning.", options: ["at", "on", "in", "from"], answer: 2, explain: "IN + parts of the day: in the morning, in the evening." },
            { q: "The books are ___ the table.", options: ["in", "on", "at", "by"], answer: 1, explain: "ON + a surface: on the table." },
            { q: "I live ___ Ho Chi Minh City.", options: ["on", "at", "in", "by"], answer: 2, explain: "IN + cities and countries: in Ho Chi Minh City." },
            { q: "He arrived ___ the airport very late.", options: ["in", "on", "at", "by"], answer: 2, explain: "Arrive AT a building or point (at the airport). Arrive IN a city or country." },
            { q: "They got married ___ 15th May.", options: ["in", "on", "at", "from"], answer: 1, explain: "ON + dates: on 15th May." },
            { q: "Please wait for me ___ the bus stop.", options: ["in", "on", "at", "by"], answer: 2, explain: "AT + a point: at the bus stop." },
            { q: "We often watch movies ___ night.", options: ["in", "on", "at", "from"], answer: 2, explain: "AT night is a fixed phrase (but in the evening)." },
            { q: "The children are playing ___ the garden.", options: ["on", "at", "in", "by"], answer: 2, explain: "IN + an area with edges: in the garden." },
            { q: "She put the letter ___ the envelope.", options: ["on", "at", "in", "by"], answer: 2, explain: "IN + inside something: in the envelope." },
            { q: "The train leaves ___ half past seven.", options: ["in", "on", "at", "by"], answer: 2, explain: "AT + clock times: at half past seven." },
            { q: "I saw him ___ the party last night.", options: ["in", "on", "at", "by"], answer: 2, explain: "AT + events: at the party, at a wedding, at a concert." },
            { q: "My parents live ___ a small village.", options: ["on", "at", "in", "by"], answer: 2, explain: "IN + towns and villages: in a small village." },
            { q: "I usually wake up ___ 6 AM.", options: ["in", "on", "at", "by"], answer: 2, explain: "AT + clock times: at 6 AM." },
            { q: "My birthday is ___ October.", options: ["at", "in", "on", "from"], answer: 1, explain: "IN + months: in October." },
            { q: "She was born ___ October 7th.", options: ["at", "in", "on", "by"], answer: 2, explain: "ON + dates: on October 7th. Month alone is IN; a date is ON." },
            { q: "I usually study English ___ the evening.", options: ["at", "on", "in", "from"], answer: 2, explain: "IN + parts of the day: in the evening." },
            { q: "He gets ___ the bus at the next stop.", options: ["in", "on", "at", "by"], answer: 1, explain: "Get ON a bus, train or plane. Get IN a car or taxi." }
          ]
        },
        {
          id: "prep-sort",
          kind: "sort",
          title: "IN, ON or AT?",
          intro: "Drag each phrase into the right box.",
          rounds: [
            {
              prompt: "Time",
              buckets: ["IN", "ON", "AT"],
              items: [["2026", "IN"], ["July", "IN"], ["the afternoon", "IN"], ["Friday", "ON"], ["my birthday", "ON"], ["1st June", "ON"], ["midnight", "AT"], ["lunchtime", "AT"], ["7:30", "AT"]]
            },
            {
              prompt: "Place",
              buckets: ["IN", "ON", "AT"],
              items: [["Hanoi", "IN"], ["a taxi", "IN"], ["the kitchen", "IN"], ["the wall", "ON"], ["the train", "ON"], ["the sofa", "ON"], ["the station", "AT"], ["home", "AT"], ["the door", "AT"]]
            }
          ]
        },
        {
          id: "prep-fill",
          kind: "fill",
          title: "Fill the gap",
          intro: "Type in, on or at. Tap a word to fill it in.",
          bank: ["in", "on", "at"],
          items: [
            { q: "I'll call you ___ Monday.", answers: ["on"], explain: "ON + days of the week." },
            { q: "Let's meet ___ noon.", answers: ["at"], explain: "AT + exact times: at noon, at midnight." },
            { q: "We have a big test ___ December.", answers: ["in"], explain: "IN + months." },
            { q: "She lives ___ Da Nang.", answers: ["in"], explain: "IN + cities." },
            { q: "The cat is sleeping ___ the sofa.", answers: ["on"], explain: "ON + a surface." },
            { q: "Someone is ___ the door.", answers: ["at"], explain: "AT + a point: at the door." },
            { q: "There's some milk ___ the fridge.", answers: ["in"], explain: "IN + inside something." },
            { q: "I was born ___ a Sunday.", answers: ["on"], explain: "ON + days." },
            { q: "Our class finishes ___ 8:15.", answers: ["at"], explain: "AT + clock times." },
            { q: "They moved here ___ 2019.", answers: ["in"], explain: "IN + years." },
            { q: "Hurry up and get ___ the train!", answers: ["on"], explain: "Get ON public transport." },
            { q: "Sorry, I'm still ___ work.", answers: ["at"], explain: "Fixed phrases: at work, at school, at home." }
          ]
        },
        {
          id: "prep-mistakes",
          kind: "mcq",
          title: "Spot the mistake",
          intro: "These are the most common slips. Pick the correct sentence.",
          items: [
            { q: "Which sentence is correct?", options: ["I wake up on 6 AM.", "I wake up at 6 AM.", "I wake up in 6 AM."], answer: 1, explain: "Clock times always take AT." },
            { q: "Which sentence is correct?", options: ["I live at Ho Chi Minh City.", "I live on Ho Chi Minh City.", "I live in Ho Chi Minh City."], answer: 2, explain: "Cities take IN." },
            { q: "Which sentence is correct?", options: ["He arrived in the airport late.", "He arrived at the airport late.", "He arrived on the airport late."], answer: 1, explain: "Arrive AT a building; arrive IN a city." },
            { q: "Which sentence is correct?", options: ["We go swimming in the weekend.", "We go swimming at the weekend.", "We go swimming by the weekend."], answer: 1, explain: "At the weekend (UK) or on the weekend (US). Never in." },
            { q: "Which sentence is correct?", options: ["My parents live at a small village.", "My parents live in a small village.", "My parents live on a small village."], answer: 1, explain: "Villages and towns take IN." },
            { q: "Which sentence is correct?", options: ["I study English at the evening.", "I study English on the evening.", "I study English in the evening."], answer: 2, explain: "In the morning, in the afternoon, in the evening. Only night takes AT." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 2
    {
      id: "food",
      title: "Describing food",
      subtitle: "Taste, smell, texture and how it's grown",
      source: "Homework · 11 Nov",
      color: "coral",
      activities: [
        {
          id: "food-match",
          kind: "match",
          title: "Word meanings",
          intro: "Drag each meaning next to its word.",
          rounds: [
            {
              prompt: "Taste and smell",
              left: "Word", right: "Meaning",
              pairs: [
                ["succulent", "tender and full of juice, in a delicious way"],
                ["juicy", "full of juice"],
                ["bitter", "a sharp taste, like coffee with no sugar"],
                ["fragrant", "has a pleasant smell"],
                ["smelly", "has a bad smell (an odour)"],
                ["flavour", "the whole taste of a food"]
              ]
            },
            {
              prompt: "Texture and ripeness",
              left: "Word", right: "Meaning",
              pairs: [
                ["rigid", "stiff; it does not bend"],
                ["smooth", "flat and even, with no bumps"],
                ["texture", "how food feels in your mouth or hand"],
                ["ripe", "ready to eat"],
                ["unripe", "not ready to eat yet"]
              ]
            },
            {
              prompt: "How it's grown",
              left: "Word", right: "Meaning",
              pairs: [
                ["organic", "grown without chemical pesticides or fertilisers"],
                ["GMO", "its genes were changed in a lab"],
                ["in-season", "grown and sold at its natural time of year"]
              ]
            }
          ]
        },
        {
          id: "food-sort",
          kind: "sort",
          title: "Sort the senses",
          intro: "Is each word about taste, smell, feel, or how food is grown?",
          rounds: [
            {
              prompt: "Sort the words",
              buckets: ["Taste", "Smell", "Feel", "Growing"],
              items: [["bitter", "Taste"], ["sweet", "Taste"], ["sour", "Taste"], ["fragrant", "Smell"], ["smelly", "Smell"], ["smooth", "Feel"], ["rigid", "Feel"], ["soft", "Feel"], ["organic", "Growing"], ["GMO", "Growing"], ["in-season", "Growing"]]
            }
          ]
        },
        {
          id: "food-fill",
          kind: "fill",
          title: "Complete the description",
          intro: "Type the missing word, or tap one from the box.",
          bank: ["juicy", "unripe", "bitter", "fragrant", "in-season", "smelly", "organic", "smooth", "succulent"],
          items: [
            { q: "This mango is so ___ that juice runs down my hand.", answers: ["juicy", "succulent"], explain: "Juicy: full of juice." },
            { q: "Don't eat that banana yet. It's still green and ___.", answers: ["unripe"], explain: "Unripe: not ready to eat yet." },
            { q: "Black coffee tastes ___ without sugar.", answers: ["bitter"], explain: "Bitter: a sharp, strong taste." },
            { q: "Fresh basil is very ___: the whole kitchen smells lovely.", answers: ["fragrant"], explain: "Fragrant: a pleasant smell." },
            { q: "Strawberries are cheap when they are ___.", answers: ["in-season", "in season"], explain: "In-season fruit is grown at its natural time, so there is more of it." },
            { q: "The old potato was soft, crooked and ___. Nobody wanted to touch it.", answers: ["smelly"], explain: "Smelly: it has a bad odour." },
            { q: "I buy ___ vegetables because they're grown without chemicals.", answers: ["organic"], explain: "Organic: no chemical pesticides or fertilisers." },
            { q: "A good apple has ___ skin, with no bumps.", answers: ["smooth"], explain: "Smooth: even, with no bumps." },
            { q: "The grilled pork was tender and ___.", answers: ["succulent", "juicy"], explain: "Succulent: tender and juicy in a delicious way." }
          ]
        },
        {
          id: "food-describe",
          kind: "speak",
          title: "Describe it",
          intro: "The homework task, spoken or typed. The judge checks your target words.",
          tasks: [
            {
              id: "food-potato",
              part: "Describe",
              title: "The crooked potato",
              question: "Describe a crooked potato that was left in the fridge for 2 months.",
              method: "DESCRIBE",
              time: 45,
              targetWords: ["smelly", "soft", "hard", "rigid", "texture", "taste", "bitter", "flavour", "smooth"],
              minTarget: 4
            },
            {
              id: "food-guava",
              part: "Describe",
              title: "The hand-picked guava",
              question: "Describe a hand-picked guava that was carefully grown and looked after.",
              method: "DESCRIBE",
              time: 45,
              targetWords: ["fragrant", "ripe", "juicy", "succulent", "smooth", "organic", "in-season", "flavour", "taste", "texture"],
              minTarget: 4
            }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 3
    {
      id: "ads",
      title: "Advertising",
      subtitle: "Vocabulary, collocations and grammar",
      source: "Lecture 2 · 12 Nov",
      color: "violet",
      activities: [
        {
          id: "ads-vocab",
          kind: "match",
          title: "Key words",
          intro: "Match each word to its Vietnamese meaning from the lecture.",
          rounds: [
            {
              prompt: "Round 1",
              left: "English", right: "Tiếng Việt",
              pairs: [
                ["advertisement", "mẩu quảng cáo"],
                ["advertising", "hoạt động quảng cáo"],
                ["brand", "thương hiệu"],
                ["campaign", "chiến dịch quảng cáo"],
                ["target audience", "đối tượng mục tiêu"],
                ["slogan", "khẩu hiệu"]
              ]
            },
            {
              prompt: "Round 2",
              left: "English", right: "Tiếng Việt",
              pairs: [
                ["billboard", "biển quảng cáo ngoài trời"],
                ["commercial", "quảng cáo trên TV hoặc radio"],
                ["sponsor", "nhà tài trợ"],
                ["promotion", "khuyến mãi"],
                ["influencer", "người có ảnh hưởng trên mạng xã hội"],
                ["engagement", "sự tương tác (like, comment, share)"]
              ]
            }
          ]
        },
        {
          id: "ads-colloc",
          kind: "match",
          title: "Collocations",
          intro: "Which words go together? Drag each phrase next to its verb.",
          rounds: [
            {
              prompt: "Verb + noun",
              left: "Verb", right: "Goes with",
              pairs: [
                ["run", "an advertisement", ["a campaign"]],
                ["launch", "a campaign", ["a product"]],
                ["target", "an audience"],
                ["build", "a brand"],
                ["increase", "engagement"],
                ["promote", "a product", ["a brand", "a campaign"]],
                ["catch", "someone's attention"]
              ]
            }
          ]
        },
        {
          id: "ads-fill",
          kind: "fill",
          title: "Use the vocabulary",
          intro: "Complete each sentence from the lecture.",
          bank: ["brands", "campaign", "target audience", "advertising", "influencer", "billboard", "commercial", "engagement", "slogan"],
          items: [
            { q: "Apple is one of the most valuable ___ in the world.", answers: ["brands"], explain: "Brand: the name and image people remember." },
            { q: "The new marketing ___ increased sales by 30%.", answers: ["campaign"], explain: "Campaign: planned ads for one goal over a period of time." },
            { q: "The ___ of this product is young professionals aged 25–35.", answers: ["target audience"], explain: "Target audience: the group the ad is aimed at." },
            { q: "Digital ___ has become more popular than traditional TV ads.", answers: ["advertising"], explain: "Advertising: the activity or industry. An advertisement is one ad." },
            { q: "The brand hired a famous ___ to promote its new product.", answers: ["influencer"], explain: "Influencer: a person with many followers on social media." },
            { q: "A huge ___ next to the highway shows the new phone.", answers: ["billboard"], explain: "Billboard: a big outdoor sign." },
            { q: "We saw a funny ___ for pizza during the football match on TV.", answers: ["commercial", "advert", "ad", "advertisement"], explain: "Commercial: an ad on TV or radio." },
            { q: "Likes, comments and shares are signs of ___.", answers: ["engagement"], explain: "Engagement: how much people interact with a post." },
            { q: "\"Just Do It\" is Nike's famous ___.", answers: ["slogan"], explain: "Slogan: a short, memorable phrase." }
          ]
        },
        {
          id: "ads-grammar",
          kind: "mcq",
          title: "Grammar: purpose, comparison, result",
          intro: "The three structures from the lecture.",
          items: [
            { q: "Companies use advertisements ___ attract more customers.", options: ["in order to", "so", "because", "for"], answer: 0, explain: "Purpose: in order to / to + verb." },
            { q: "They hired influencers ___ reach a younger audience.", options: ["for", "to", "so", "because of"], answer: 1, explain: "Purpose: to + verb." },
            { q: "Online advertising is often more effective ___ traditional billboards.", options: ["that", "as", "than", "then"], answer: 2, explain: "Comparison: more + adjective + than." },
            { q: "TV commercials are ___ expensive than online ads.", options: ["most", "more", "much", "very"], answer: 1, explain: "Comparison: more expensive than." },
            { q: "The campaign went viral. ___, the brand gained millions of new followers.", options: ["However", "Although", "As a result", "Unless"], answer: 2, explain: "Result: As a result, ... / Consequently, ..." },
            { q: "Sales doubled. ___, the company launched a second campaign.", options: ["Consequently", "Despite", "Whereas", "Unless"], answer: 0, explain: "Consequently = as a result." }
          ]
        },
        {
          id: "ads-fix",
          kind: "mcq",
          title: "Fix the sentence",
          intro: "Sentences like the ones written in class. Choose the correct form.",
          items: [
            { q: "The company ___ an advertisement to build a brand.", options: ["run", "runs", "running", "to run"], answer: 1, explain: "The company is singular: the company runs (or past: ran)." },
            { q: "Last month, the brand ___ an advertisement to catch teenagers' attention.", options: ["run", "runned", "ran", "running"], answer: 2, explain: "Past simple of run is ran." },
            { q: "The new product ___ on social media to increase engagement.", options: ["has promoted", "has been promoted", "has promoting", "promote"], answer: 1, explain: "The product does not promote itself, so use the passive: has been promoted." },
            { q: "Is this sentence correct? \"Cosmetic brands are often promoted by influencers.\"", options: ["Yes, it is correct", "No: use 'promote'", "No: use 'is'"], answer: 0, explain: "Correct passive: brands are promoted by influencers." }
          ]
        },
        {
          id: "ads-order",
          kind: "order",
          title: "Build the paragraph",
          intro: "Put the sentences in a logical order.",
          rounds: [
            {
              prompt: "The lecture's model paragraph",
              items: [
                "A fashion brand launched a new advertising campaign on social media last month.",
                "They hired several popular influencers to promote their products and target a younger audience.",
                "The campaign used short videos and catchy slogans to catch people's attention.",
                "As a result, engagement increased dramatically and the brand sold more products than expected."
              ]
            },
            {
              prompt: "Plan for the discussion essay",
              slots: ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Conclusion"],
              items: [
                "Introduce the topic and give your opinion",
                "View 1: advertising is useful and gives information",
                "View 2: advertising makes people buy things they don't need",
                "Repeat your opinion and sum up your reasons"
              ]
            }
          ]
        },
        {
          id: "ads-essay",
          kind: "write",
          title: "Write the essay",
          intro: "The lecture's writing task, with feedback.",
          tasks: [
            {
              id: "ads-essay-task",
              title: "Advertising: discuss both views",
              prompt: "Some people believe that advertising is useful and helps people make better choices. Others think that advertising only encourages people to buy things they do not need. Discuss both views and give your own opinion.",
              method: "ESSAY",
              minWords: 130,
              maxWords: 220,
              targetWords: ["advertisement", "advertising", "brand", "campaign", "target audience", "promote", "engagement"],
              minTarget: 5,
              notes: "About 150 words. Use at least 5 key words, 2 structures (to + verb, comparison, as a result) and 1–2 collocations."
            }
          ]
        },
        {
          id: "ads-speak",
          kind: "speak",
          title: "Part 3: advertising",
          intro: "Give your opinion with OREO.",
          tasks: [
            { id: "ads-p3-choices", part: 3, title: "Better choices?", question: "Do you think advertising helps people make better choices?", method: "OREO", time: 60, targetWords: ["advertising", "brand", "promote", "campaign", "target audience"], minTarget: 2 },
            { id: "ads-p3-influencers", part: 3, title: "Influencers", question: "Why do companies pay influencers to promote their products?", method: "OREO", time: 60, targetWords: ["influencer", "engagement", "target audience", "brand", "promote"], minTarget: 2 },
            { id: "ads-p3-online", part: 3, title: "Online vs billboards", question: "Is online advertising more effective than billboards? Why?", method: "OREO", time: 60, targetWords: ["billboard", "advertising", "engagement", "campaign"], minTarget: 2 }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 4
    {
      id: "speaking",
      title: "Speaking skills",
      subtitle: "Parts 1, 2 and 3 · Topic: tidiness",
      source: "Slides + recording · 18 Nov",
      color: "amber",
      activities: [
        {
          id: "speaking-test",
          kind: "mcq",
          title: "Know the test",
          intro: "Quick questions on how the Speaking test works.",
          items: [
            { q: "How long is Part 1?", options: ["1–2 minutes", "4–5 minutes", "10 minutes", "20 minutes"], answer: 1, explain: "Part 1 is 4–5 minutes of questions about you." },
            { q: "In Part 2, how long do you get to plan?", options: ["No time", "30 seconds", "1 minute", "5 minutes"], answer: 2, explain: "One minute to make notes, then up to 2 minutes to talk." },
            { q: "Which part is a deeper discussion of ideas?", options: ["Part 1", "Part 2", "Part 3"], answer: 2, explain: "Part 3 asks about people and society, linked to the Part 2 topic." },
            { q: "Which of these is NOT scored?", options: ["Fluency", "Your accent", "Grammar", "Vocabulary"], answer: 1, explain: "Any accent is fine. Pronunciation is about being easy to understand." },
            { q: "A strong Part 1 answer is usually…", options: ["One word", "2–3 sentences", "A 2-minute speech"], answer: 1, explain: "Answer, give a reason, add an example: about 2–3 sentences." },
            { q: "You didn't understand the question. What can you do?", options: ["Stay silent", "Guess the topic", "Ask: \"Could you repeat that?\""], answer: 2, explain: "Asking for repetition is allowed and does not lower your score." },
            { q: "In Part 2, when should you stop talking?", options: ["After 30 seconds", "When the examiner stops you", "After the first cue point"], answer: 1, explain: "Keep going until the examiner says \"Thank you\"." }
          ]
        },
        {
          id: "speaking-order",
          kind: "order",
          title: "Build strong answers",
          intro: "Drag the sentences into the method's order.",
          rounds: [
            {
              prompt: "Part 1 · A-R-E · \"Do you like reading?\"",
              slots: ["Answer", "Reason", "Example"],
              items: ["Yes, quite a lot.", "It helps me relax after work.", "Right now, I'm reading a mystery novel."]
            },
            {
              prompt: "Part 3 · OREO · \"Why do people like travelling?\"",
              slots: ["Opinion", "Reason", "Example", "Opinion"],
              items: ["I'd say it's mainly to relax.", "Work and study are stressful.", "For example, my parents visit Da Lat every summer.", "So, travel helps people escape their routine."]
            },
            {
              prompt: "Part 2 · your 2 minutes",
              slots: ["~10 sec", "~30 sec", "~50 sec", "~30 sec"],
              items: ["Introduce: \"I'd like to describe…\"", "Describe: where, when, what", "Tell a story: \"What I remember most is…\"", "Explain why: \"It matters because…\""]
            }
          ]
        },
        {
          id: "speaking-phrases",
          kind: "sort",
          title: "Useful phrases",
          intro: "What does each phrase help you do?",
          rounds: [
            {
              prompt: "Sort the phrases",
              buckets: ["Give an opinion", "Compare", "Buy time"],
              items: [["I'd say that…", "Give an opinion"], ["In my view…", "Give an opinion"], ["From my point of view…", "Give an opinion"], ["Compared to the past…", "Compare"], ["Whereas…", "Compare"], ["Unlike in my parents' time…", "Compare"], ["That's an interesting question…", "Buy time"], ["Let me think…", "Buy time"], ["Another thing is…", "Buy time"]]
            }
          ]
        },
        {
          id: "speaking-better",
          kind: "mcq",
          title: "Which answer is better?",
          intro: "Choose the answer an examiner would like most.",
          items: [
            { q: "\"Do you like reading?\"", options: ["Yes, I do.", "Yes, quite a lot. It helps me relax after work, and right now I'm reading a mystery novel.", "Reading is an activity that many people around the world enjoy for many reasons, and there are many types of books…"], answer: 1, explain: "Answer + reason + example, in 2–3 natural sentences." },
            { q: "\"Are you a tidy person?\"", options: ["Not really, to be honest. I'm so busy that my desk gets messy, but I tidy everything at the weekend.", "No.", "Tidiness is very important in modern society."], answer: 0, explain: "A direct answer, an honest reason and a real detail. The third one doesn't answer about you." },
            { q: "Part 2 planning: what should your notes look like?", options: ["Full sentences for the whole talk", "5–8 keywords, one per cue point", "Nothing: just start talking"], answer: 1, explain: "Keywords are fast to write and easy to read while you talk." },
            { q: "\"Why do people travel more today?\" (Part 3)", options: ["I like travelling.", "I'd say flights are much cheaper now. For example, budget airlines fly to Bangkok for very little. So travel is easier for everyone.", "Because."], answer: 1, explain: "Part 3 is about people in general: opinion, reason, example, then sum up." },
            { q: "Which is a good way to keep talking in Part 2?", options: ["\"Another thing is…\"", "Stopping after 40 seconds", "Repeating the question"], answer: 0, explain: "Phrases like \"Another thing is…\" or \"What I mean is…\" keep you going." }
          ]
        },
        {
          id: "speaking-judge-p1",
          kind: "speak",
          title: "Part 1: tidiness",
          intro: "The topic from the 18 Nov recording. Answer with A-R-E.",
          tasks: [
            { id: "tidy-person", part: 1, title: "Are you tidy?", question: "Are you a tidy person?", method: "ARE", time: 30, targetWords: ["tidy", "messy", "organised", "clean up", "put away"], minTarget: 1 },
            { id: "tidy-room", part: 1, title: "Your room", question: "How do you keep your room tidy?", method: "ARE", time: 30, targetWords: ["tidy", "messy", "organised", "clean up", "put away"], minTarget: 1 },
            { id: "tidy-child", part: 1, title: "As a child", question: "Were you tidy when you were a child?", method: "ARE", time: 30, targetWords: ["tidy", "messy", "toys", "parents"], minTarget: 1 },
            { id: "tidy-work", part: 1, title: "Tidy at work", question: "Is it important to keep your desk tidy at work or school?", method: "ARE", time: 30, targetWords: ["tidy", "organised", "focus", "messy"], minTarget: 1 }
          ]
        },
        {
          id: "speaking-judge-p23",
          kind: "speak",
          title: "Parts 2 and 3",
          intro: "The cue card from the slides, plus two Part 3 questions.",
          tasks: [
            { id: "p2-place", part: 2, title: "A place you like to visit", question: "Describe a place you like to visit.", cue: ["where it is", "how often you go", "what you do there", "and explain why you like it"], method: "P2", prep: 60, time: 120 },
            { id: "p3-travel", part: 3, title: "Why people travel", question: "Why do people like travelling?", method: "OREO", time: 60 },
            { id: "p3-tidy-school", part: 3, title: "Tidiness at school", question: "Should schools teach children to be tidy?", method: "OREO", time: 60, targetWords: ["tidy", "responsible", "habit", "organised"], minTarget: 1 }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 5
    {
      id: "writing",
      title: "Writing skills",
      subtitle: "Task 1 reports and Task 2 essays",
      source: "Slides · 19 Nov",
      color: "indigo",
      activities: [
        {
          id: "writing-tf",
          kind: "mcq",
          title: "True or false?",
          intro: "The warm-up quiz from the slides, plus two more.",
          items: [
            { q: "Task 1 needs your opinion.", options: ["True", "False"], answer: 1, explain: "Task 1 only describes the data. No opinions." },
            { q: "Task 2 is worth more marks than Task 1.", options: ["True", "False"], answer: 0, explain: "Task 2 counts twice as much." },
            { q: "140 words is fine for Task 1.", options: ["True", "False"], answer: 1, explain: "Under 150 words loses marks." },
            { q: "Bullet points are fine in essays.", options: ["True", "False"], answer: 1, explain: "Write full paragraphs." },
            { q: "Every Task 1 needs an overview.", options: ["True", "False"], answer: 0, explain: "No clear overview usually means Band 5 or lower for Task Achievement." },
            { q: "You should spend about 40 minutes on Task 2.", options: ["True", "False"], answer: 0, explain: "20 minutes for Task 1, 40 for Task 2." }
          ]
        },
        {
          id: "writing-types",
          kind: "mcq",
          title: "Name the essay type",
          intro: "Read the last line of each question.",
          items: [
            { q: "University should be free. Do you agree or disagree?", options: ["Opinion", "Discussion", "Problem–solution", "Advantages", "Two-part"], answer: 0, explain: "Clue: \"agree or disagree\"." },
            { q: "Cities are overcrowded. What problems does this cause, and how can they be solved?", options: ["Opinion", "Discussion", "Problem–solution", "Advantages", "Two-part"], answer: 2, explain: "Clue: \"problems … solved\"." },
            { q: "Some prefer home-schooling; others prefer school. Discuss both views and give your opinion.", options: ["Opinion", "Discussion", "Problem–solution", "Advantages", "Two-part"], answer: 1, explain: "Clue: \"Discuss both views\"." },
            { q: "More people work from home. Do the advantages outweigh the disadvantages?", options: ["Opinion", "Discussion", "Problem–solution", "Advantages", "Two-part"], answer: 3, explain: "Clue: \"advantages outweigh the disadvantages\"." },
            { q: "Many young people move to big cities. Why is this? Is it a positive or negative development?", options: ["Opinion", "Discussion", "Problem–solution", "Advantages", "Two-part"], answer: 4, explain: "Two separate direct questions." },
            { q: "Some people believe advertising helps people make better choices. Others think it makes people buy things they don't need. Discuss both views and give your opinion.", options: ["Opinion", "Discussion", "Problem–solution", "Advantages", "Two-part"], answer: 1, explain: "The advertising essay from Lecture 2 is a discussion essay." }
          ]
        },
        {
          id: "writing-order",
          kind: "order",
          title: "PEEL and paragraph plans",
          intro: "Put each plan in order.",
          rounds: [
            {
              prompt: "Body paragraph · PEEL",
              slots: ["Point", "Explain", "Example", "Link"],
              items: ["Firstly, free university gives everyone an equal chance.", "Poorer students would no longer be held back by cost.", "For example, Germany has free tuition and many skilled workers.", "Therefore, free education helps society as a whole."]
            },
            {
              prompt: "Task 1 · four paragraphs",
              slots: ["1", "2", "3", "4"],
              items: ["Introduction: paraphrase the question", "Overview: main trends, no numbers", "Details 1: key numbers and comparisons", "Details 2: more key numbers"]
            }
          ]
        },
        {
          id: "writing-fill",
          kind: "fill",
          title: "Change words and linkers",
          intro: "From the café chart and the linker exercise.",
          bank: ["rose", "fell", "steadily", "overtook", "However", "Furthermore", "As a result"],
          items: [
            { q: "Coffee sales ___ from 120 to 300 cups a day.", answers: ["rose", "increased", "grew", "went up"], explain: "Upward change: rose / increased / grew." },
            { q: "Tea sales ___ slightly each year.", answers: ["fell", "decreased", "dropped", "declined"], explain: "Downward change: fell / decreased / dropped." },
            { q: "Coffee sales rose ___ from 2019 to 2024.", answers: ["steadily", "gradually"], explain: "The adverb goes after the verb: rose steadily." },
            { q: "In 2021, coffee ___ tea for the first time.", answers: ["overtook", "passed", "overtaken"], explain: "Overtook = became higher than." },
            { q: "Online learning is cheap. ___, it can feel lonely.", answers: ["However", "On the other hand", "Nevertheless"], explain: "Contrast: However, ..." },
            { q: "Cars pollute the air. ___, they cause traffic jams.", answers: ["Furthermore", "In addition", "Moreover", "Also"], explain: "Adding: Furthermore, ..." },
            { q: "Fuel prices rose sharply. ___, fewer people drove.", answers: ["As a result", "Therefore", "Consequently", "So"], explain: "Result: As a result, ..." }
          ]
        },
        {
          id: "writing-formal",
          kind: "match",
          title: "Keep it formal",
          intro: "Match each informal word to its formal version.",
          rounds: [
            {
              prompt: "Informal → formal",
              left: "Informal", right: "Formal",
              pairs: [["kids", "children"], ["a lot of", "many"], ["don't", "do not"], ["get better", "improve"], ["really big", "significant"], ["it's", "it is"]]
            }
          ]
        },
        {
          id: "writing-linkers",
          kind: "sort",
          title: "Sort the linkers",
          intro: "What job does each linker do?",
          rounds: [
            {
              prompt: "Sort the linkers",
              buckets: ["Adding", "Contrast", "Result", "Example"],
              items: [["Furthermore", "Adding"], ["In addition", "Adding"], ["However", "Contrast"], ["On the other hand", "Contrast"], ["Therefore", "Result"], ["As a result", "Result"], ["For instance", "Example"], ["such as", "Example"]]
            }
          ]
        },
        {
          id: "writing-best",
          kind: "mcq",
          title: "Pick the best sentence",
          intro: "Overview, thesis and conclusion.",
          items: [
            { q: "Which is the best Task 1 overview for the café chart?", options: ["Coffee sales were 120 in 2019, 150 in 2020 and 180 in 2021.", "Overall, coffee sales rose steadily while tea sales declined, and coffee overtook tea by 2021.", "I think coffee is better than tea.", "The chart shows cups sold at a café."], answer: 1, explain: "An overview starts with Overall, gives the main trends and uses no numbers." },
            { q: "Which is the strongest thesis? (University should be free. Do you agree?)", options: ["This essay will talk about free university.", "University is a thing that many people discuss.", "I strongly agree that university should be free, as it creates equal chances and a skilled workforce."], answer: 2, explain: "Clear view plus two reasons, which become your two body paragraphs." },
            { q: "Which is the best conclusion sentence?", options: ["In conclusion, I believe university should be free because it creates equal chances and a skilled workforce.", "In conclusion, another reason is that students can travel more.", "That's all I want to say about the topic."], answer: 0, explain: "Restate your view and sum up. No new ideas in the conclusion." }
          ]
        },
        {
          id: "writing-ai",
          kind: "write",
          title: "Short writing",
          intro: "Two short tasks with instant feedback.",
          tasks: [
            {
              id: "write-overview",
              title: "Write the café overview",
              prompt: "The table shows cups of coffee and tea sold per day at a café from 2019 to 2024. Write the OVERVIEW paragraph only (1–2 sentences).",
              table: { head: ["Year", "2019", "2020", "2021", "2022", "2023", "2024"], rows: [["Coffee", "120", "150", "180", "210", "260", "300"], ["Tea", "200", "190", "170", "160", "150", "140"]] },
              method: "OVERVIEW",
              minWords: 15,
              maxWords: 60
            },
            {
              id: "write-intro",
              title: "Write an introduction",
              prompt: "University should be free. Do you agree or disagree? Write the INTRODUCTION only: paraphrase the question and give a clear thesis with two reasons.",
              method: "INTRO",
              minWords: 30,
              maxWords: 80
            }
          ]
        }
      ]
    }
  ]
};
