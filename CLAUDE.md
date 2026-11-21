# CALENDR: project notes

Every Claude Code session reads this file first. Update it whenever a decision changes.
Items marked **(guess)** are unverified estimates from early planning chats. Confirm them before relying on them.

Last updated: 2026-11-21 (first draft, no code yet)

---

## 1. What we're building

An AI calendar assistant that people use by **text or phone call** (Twilio). They say what they need in plain language and it goes into their connected Google Calendar. Suggestions and reminders are optional.

**The edge is the channel and the niche, not the AI.** Gemini already adds Google Calendar events for free. We win where Google doesn't go: SMS and voice with no app to open, and texting *other people* (customers), which Gemini can't do.

### B2C: personal assistant you text (launches first)
- "Practice Tuesdays at 4, remind me the night before" → event plus reminder in Google Calendar.
- Optional morning text with the day's plan.
- Optional suggestions, e.g. "You have a free 2 to 4 block. Want your workout there?"
- Who it's for: busy students, parents, people who don't live in Google's apps.

### B2B: scheduling for small home-service businesses (the money version)
- Owner or tech texts "Book the Smiths, Tuesday 3pm, pressure wash" → it lands on the team calendar.
- **It automatically texts the customer a confirmation and a reminder.** This is the headline feature, because no-shows cost these businesses real money.
- Who it's for: pressure washing, lawn care, cleaning, pet waste, handyman (1 to 10 person crews).
- May eventually merge with PocketRep.

---

## 2. One shared engine, two front doors

Both versions run on the same pipeline. Build it once.

```
Inbound SMS / call (Twilio)
   → speech-to-text if it's a call
   → AI parser (Claude): intent, title, date/time, duration, recurrence,
     reminder, attendees/customer phone. Ask a follow-up text if unclear.
   → Google Calendar API: create / edit / delete / find event
   → Outbound SMS (Twilio): confirm to the user; B2B also texts the customer
   → Scheduler: reminders, morning briefs, customer reminders
```

What the two versions add on top of it:
- **B2C**: one user, one calendar, personal preferences, suggestion engine.
- **B2B**: a business account, a team calendar or calendars, a customer list, customer message templates, and a STOP/opt-out flow for customers.

### Tech stack (proposed, not decided)
- AI parsing: Claude API (latest Sonnet-class model for cost/speed).
- Messaging and voice: Twilio (SMS plus Programmable Voice). Needs A2P 10DLC registration for US business texting **(guess: takes days to weeks, start early)**.
- Calendar: Google Calendar API through OAuth.
- Database and auth: Supabase (connector already available).
- Hosting: Railway or Render for the webhook server, Netlify for the marketing site (all connectors available).
- Payments: Stripe subscriptions (later, for B2B pilots and B2C paid tier).
- Email: Resend (receipts, onboarding).
- Error tracking: Sentry.

---

## 3. Build order

1. **Engine plus B2C free beta.** Friends and DECA contacts as Google OAuth *test users* (no verification needed yet). Goal: find parsing bugs and learn what people actually text.
2. **Landing site and privacy policy** on our own domain (needed for Google verification anyway). Include a waitlist.
3. **Submit Google OAuth verification** (see checklist below).
4. **B2B features**: customer confirmation and reminder texts, team calendar, customer list.
5. **B2B paid pilots** with 3 to 5 local home-service businesses.
6. Then decide: open B2C paid tier, or go all-in on B2B.

---

## 4. Pricing (all guesses)

| Plan | Price | Notes |
|---|---|---|
| B2C free tier | $0 | Limited messages per month **(guess)** |
| B2C paid | ~$5 to 8/mo **(guess)** | Must sit under Reclaim ($10/seat/mo yearly) |
| B2B pilot | TBD **(guess: $30 to 100/mo per business)** | Not researched yet |

Competitors seen so far:
- Gemini: free, adds and edits Google Calendar events, but can't invite or text other people.
- Reclaim: free Lite; Starter $10 and Business $15 per seat per month, billed yearly.
- Motion: $19 to 34/mo, no free plan.
- **Not yet checked:** Jobber and Housecall Pro scheduling and pricing. Research this before setting B2B prices.

Cost to watch: Twilio per-SMS and per-minute fees plus AI tokens per message. Price B2B so customer reminder texts are covered with margin.

---

## 5. Google OAuth sensitive-scope verification checklist

Calendar scopes are **sensitive**. Until verified, only listed test users can connect (that's fine for the beta).

- [ ] Use the narrowest scope that works (e.g. `calendar.events` rather than full `calendar`, if possible).
- [ ] Own a domain and verify it in Google Search Console.
- [ ] Homepage on that domain that explains what the app does.
- [ ] Privacy policy **hosted on the same domain as the homepage**, saying exactly what Google data is used and why, and that it isn't sold or used for ads.
- [ ] Terms of service page.
- [ ] OAuth consent screen: app name, logo, support email, homepage link, privacy policy link, authorized domains.
- [ ] A written justification for each sensitive scope.
- [ ] A demo video showing the consent flow and how each scope is used.
- [ ] Add beta testers as test users while in "Testing" mode.
- [ ] Submit for verification. Review is usually 3 to 5 business days, longer if Google asks questions.
- [ ] Follow Google's API Services User Data Policy (Limited Use rules).

Twilio compliance (do in parallel):
- [ ] Register A2P 10DLC brand and campaign for business texting.
- [ ] Opt-in wording on signup, and STOP/HELP handling on every number.
- [ ] B2B: the business confirms its customers agreed to receive texts.

---

## 6. Brand and marketing rules

- Garren does **not** appear personally on social media. Brand accounts are faceless.
- Content is short-form video showing the product solving a real problem in 15 to 30 seconds.
- Collect emails on the landing page. Own the list.

---

## 7. Working rules for Claude sessions

- Ask Garren before creating repos, pushing to main, deploying, connecting a service, or sending anything to real users or customers.
- One session per feature or fix ("add Twilio webhook", "parse recurring events"). Let this file and the repo carry context between sessions.
- Never commit secrets. Keys go in environment variables.
- Mark new guesses **(guess)** in this file until verified.

## 8. Open questions

- Product name and domain (is "CALENDR" final?).
- Which B2B niche to pilot first.
- Narrowest Google Calendar scope that still supports team calendars.
- Jobber and Housecall Pro: compete, integrate, or avoid?
