sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: saves new note into notes variable
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes with newly created one