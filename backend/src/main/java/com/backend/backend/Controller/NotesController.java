package com.backend.backend.Controller;

import com.backend.backend.Services.NotesService;
import com.backend.backend.model.Notes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NotesController {

    @Autowired
    private NotesService notesService;

    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody Notes note) {
        try {
            Notes saved = notesService.createNote(note);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getNotesByUser(@PathVariable String username) {
        List<Notes> notes = notesService.getNotesForUser(username);
        return ResponseEntity.ok(notes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNote(@PathVariable String id, @RequestBody Notes note) {
        try {
            Notes updated = notesService.updateNote(id, note);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable String id) {
        try {
            notesService.deleteNote(id);
            return ResponseEntity.ok("Note deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}
