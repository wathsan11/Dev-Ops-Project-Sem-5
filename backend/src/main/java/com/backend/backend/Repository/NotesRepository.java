package com.backend.backend.Repository;

import com.backend.backend.model.Notes;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotesRepository extends MongoRepository<Notes, ObjectId> {
    List<Notes> findByUsernameIgnoreCase(String username);
}
