package com.travel.catalog.service;

import com.travel.catalog.entity.Destination;
import com.travel.catalog.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository repository;

    public List<Destination> getAllDestinations() {
        return repository.findAll();
    }

    public Destination getDestinationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
    }

    public Destination createDestination(Destination destination) {
        return repository.save(destination);
    }

    public void deleteDestination(Long id) {
        repository.deleteById(id);
    }
}