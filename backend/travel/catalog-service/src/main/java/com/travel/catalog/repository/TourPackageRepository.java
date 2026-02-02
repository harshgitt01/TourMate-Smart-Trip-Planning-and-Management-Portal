package com.travel.catalog.repository;

import com.travel.catalog.entity.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TourPackageRepository extends JpaRepository<TourPackage, Long> {
    
    // Custom method to find packages by destination ID
    List<TourPackage> findByDestinationId(Long destinationId);
}