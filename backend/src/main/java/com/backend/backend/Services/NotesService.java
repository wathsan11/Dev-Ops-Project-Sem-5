package com.backend.backend.Services;

import com.backend.backend.Repository.NotesRepository;
import com.backend.backend.model.Notes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotesService {
    @Autowired
    private NotesRepository notesRepository;

    public Notes createNote(Notes note){
        return notesRepository.save(note);
    }

    public List<Notes> getNotesForUser(String username){
        return notesRepository.findByUsernameIgnoreCase(username);
    }

    public Optional<Notes> findById(ObjectId id){
        return notesRepository.findById(id);
    }
}
