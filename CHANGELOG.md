## Feedback recived from Amazon & TODO
- [ ] Your skill does not meet invocation name requirement #2: One-word invocation names are not allowed, unless the invocation name is unique to your brand/intellectual property.  
    - [ ] Change invocation name to `"My Gradebook"`
- [ ] The example phrases that you choose to present to users in the companion app must be included in your sample utterances. These sample utterances should not include the wake word or any relevant launch phrasing.
    - [ ] Add `GetLastAssignmentsIntent` to sample utterances in app configuration 
- [ ] The example phrases that you chose to present to users in the companion app currently use unsupported launch phrasing. More information available [here.](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/supported-phrases-to-begin-a-conversation?ref_=pe_679090_102923190)
    - [ ] Change launch phrases to match the outlined way. ie. Use connecting words. 
- [ ] When attempting to invoke the skill with your first and second example phrase, the skill fails to recognize and the third example throws an error.  The example phrases must function without error since these are interactions that users are most likely to try.  Please see test case 3.1 from our Submission Checklist for guidance on example phrases.
    - [ ] Error Handling
        - [x] implement Promises?
    - [ ] Add request to link to Canvas and to link skill to Amazon
- [ ] When invoking the skill with the following command “open grades”, the skill’s response is irrelevant to the request.  Please see test case 4.3 from our Submission Checklist for guidance on intent responses.
    - [ ] Remove intent
- [ ] When invoking the “GetUpcommingEventsIntent” intent, the skill’s fails to recognize.  Please see test case 4.3 from our Submission Checklist for guidance on intent responses. More information available [here.](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-voice-interface-and-user-experience-testing?ref_=pe_679090_102923190#intent-response-design)
    - [ ] Implement `"to"` phrase. Ie. "Alexa ask My Gradebook to tell me about my upcoming assignments".
- [ ] If user input is required after launching the skill with no intent, a welcome prompt must be provided which describes what users can ask of the skill and the session must remain open for a user response. If the session closes after launching the skill, a core functionality must be completed without prompting users to speak. Also the welcome phrase must be appropriate to the context of the skill’s functionality as defined in its description. Please see test case 4.1 from our Submission Checklist for guidance on session management.
    - [ ] Add instructions, keep session open and forward to appropriate intent. 
- [ ] Update readme
   
## Change log	
- Added promise support for all of storage  
	- Including database and get/put requests  
- Added `getLastGraded` global support  
