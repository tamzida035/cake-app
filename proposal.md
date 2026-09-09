# Proposal: Show Modal with Transcribed Text After Voice Recording

## Current State

You already have **two** modal structures in the template and **corresponding CSS** — but neither is wired up in JavaScript:

1. **Bootstrap static backdrop modal** (lines 22–34 of [add_new_voice_recipe.pug](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/views/user_views/add_new_voice_recipe.pug#L22-L34)) — uses Bootstrap's `modal-dialog` classes but its body is empty and the Confirm button has no handler.
2. **Custom CSS modal** (lines 159–167 of [add_new_voice_recipe.pug](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/views/user_views/add_new_voice_recipe.pug#L159-L167)) — styled by [voice_recipe.css](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/stylesheets/voice_recipe.css) using `.modal.visible` toggling, but also not connected.

The JavaScript in [add_voice_recipe.js](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/javascripts/add_voice_recipe.js) has the `ShowConfirm` class and `openModal`/`closeModal` functions **commented out** (lines 90–141, 235–257). The `onresult` handler (line 148) has multiple `//openModal() //toDo` placeholders but never actually opens any modal.

---

## Proposed Changes — 3 Files to Edit

### 1. Pick ONE modal and clean up the template

**File:** [add_new_voice_recipe.pug](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/views/user_views/add_new_voice_recipe.pug)

> [!IMPORTANT]
> Choose **one** modal approach. I recommend the **custom CSS modal** (lines 159–167) since you already have dedicated CSS for it in `voice_recipe.css` and it doesn't depend on Bootstrap JS which is partially conflicting in your setup (you load Bootstrap 3 JS but use Bootstrap 5 markup).

- **Remove** the unused Bootstrap static backdrop modal markup (lines 22–34) and the test buttons `t_btn1`/`t_btn2` (line 35–36).
- **Update** the custom modal (lines 159–167) to:
  - Add an `id` to the modal container (e.g., `id="voiceModal"`)
  - Add a `<p>` element with an `id` inside `.modal-body` to hold the transcribed text (e.g., `p(id="modal-transcript-text")`)
  - Style the "Yes, Confirm" and "No, discard" buttons with proper classes (e.g., `class="button confirm_button_color button_small_size"` and `class="button cancel_button_color button_small_size"`)

```pug
//- Updated custom modal (replace lines 159-167)
div(class="modal" id="voiceModal")
  span(class="modal-backdrop")
  div(class="modal-content")
    div(class="modal-body")
      h3 You have said:
      p(id="modal-transcript-text")
    div(class="modal-footer")
      button(class="button confirm_button_color button_small_size" id="modal-confirm-btn") Yes, Confirm
      button(class="button cancel_button_color button_small_size" id="modal-discard-btn") No, Discard
```

---

### 2. Wire up the modal in JavaScript

**File:** [add_voice_recipe.js](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/javascripts/add_voice_recipe.js)

- **Uncomment and adapt** the `openModal` / `closeModal` functions (currently commented out at lines 235–241):

```js
function openModal(transcriptText) {
  document.getElementById('modal-transcript-text').textContent = transcriptText;
  document.getElementById('voiceModal').classList.add('visible');
}

function closeModal() {
  document.getElementById('voiceModal').classList.remove('visible');
}
```

- **Replace every `//openModal() //toDo` placeholder** in the `onresult` handler with an actual call. There are **5 locations** to update:
  - [Line 174](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/javascripts/add_voice_recipe.js#L174) — valid section title detected → `openModal("Section: " + section_title + "\nStep " + recipe_step + ": " + r_step);`
  - [Line 194](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/javascripts/add_voice_recipe.js#L194) — invalid section title → `openModal("Invalid format: " + final_transcript);`
  - [Line 208](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/javascripts/add_voice_recipe.js#L208) — empty recipe step → `openModal("No step content detected after 'next'");`
  - [Line 214](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/javascripts/add_voice_recipe.js#L214) — valid recipe step → `openModal("Step " + recipe_step + ": " + r_step);`
  - [Line 221](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/javascripts/add_voice_recipe.js#L221) — invalid format → `openModal("Could not parse recipe step: " + final_transcript);`

- **Add event listeners** for the Confirm and Discard buttons inside the `DOMContentLoaded` block (after line 340):

```js
document.getElementById('modal-confirm-btn').addEventListener('click', function() {
  // User confirmed the transcript — proceed with saving/processing
  closeModal();
  // TODO: send the confirmed step to the server or add it to a list
});

document.getElementById('modal-discard-btn').addEventListener('click', function() {
  // User discarded — reset the transcript and close
  reset_recipe_step();
  closeModal();
});
```

- **Remove** all the old commented-out `ShowConfirm` class code (lines 90–141) and the commented-out `makeModalVisible` function (lines 235–257) to clean up the file.

---

### 3. Minor CSS fix (optional but recommended)

**File:** [voice_recipe.css](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/stylesheets/voice_recipe.css)

The existing CSS is already functional. Optionally add a `z-index` to the `.modal` itself so it sits above the page content:

```css
.modal {
  z-index: 999; /* add this line */
}
```

---

## Summary of Changes

| File | What to do |
|------|-----------|
| [add_new_voice_recipe.pug](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/views/user_views/add_new_voice_recipe.pug) | Remove Bootstrap modal (L22-36). Update custom modal (L159-167) with IDs and proper button classes. |
| [add_voice_recipe.js](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/javascripts/add_voice_recipe.js) | Add `openModal(text)` / `closeModal()` functions. Replace 5 `//openModal() //toDo` comments with actual calls. Add Confirm/Discard button listeners. Remove old commented-out code. |
| [voice_recipe.css](file:///Users/tamzidatarannum/Documents/software_project/temp_cake/public/stylesheets/voice_recipe.css) | (Optional) Add `z-index: 999` to `.modal`. |

> [!TIP]
> The custom modal approach keeps things simple — no Bootstrap JS dependency conflicts, and you already have all the CSS animations (fade-in via `visibility`/`opacity` transition, slide-down via `top` transition) ready in `voice_recipe.css`.
