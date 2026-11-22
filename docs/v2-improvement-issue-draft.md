# GitHub Issue Draft — V2 Improvement

**Title:** Add more control over target audience and narrative angle

**Description:**

### User feedback

During early feedback, one small-business owner asked for more ways to customize the target audience and narrative angle. They specifically mentioned age, gender, and income as useful targeting details. Other testers found the guided form straightforward and the captions reasonably accurate.

### Why this matters

More control may help owners get a caption that better fits their intended customer and brand approach. The current form should remain quick to complete for people who do not want to write a detailed prompt.

### Possible v2 scope

- Add optional audience details, such as age range or customer profile.
- Add a narrative-angle choice, such as subtle promotion, benefits-led, story-led, or announcement.
- Include selected values in the server-side generation prompt and validate them.
- Keep these options optional so the basic flow stays simple.

### Acceptance criteria

- A user can complete generation without filling optional audience or angle controls.
- When selected, audience and narrative choices are reflected in the generated caption.
- Existing validation and server-side API-key handling continue to apply.
- Test the change with small-business users before treating the new options as successful.
