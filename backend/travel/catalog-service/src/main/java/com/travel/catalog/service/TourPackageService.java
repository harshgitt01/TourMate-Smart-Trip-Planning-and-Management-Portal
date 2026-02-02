package com.travel.catalog.service;

import com.travel.catalog.entity.TourPackage;
import com.travel.catalog.repository.TourPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourPackageService {

    private final TourPackageRepository repository;

    public List<TourPackage> getAllPackages() {
        return repository.findAll();
    }

    public List<TourPackage> getPackagesByDestinationId(Long destinationId) {
        return repository.findByDestinationId(destinationId);
    }

    public TourPackage getPackageById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
    }

    public TourPackage createPackage(TourPackage tourPackage) {
        return repository.save(tourPackage);
    }

    public void deletePackage(Long id) {
        repository.deleteById(id);
    }
}