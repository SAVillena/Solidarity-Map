package com.solidaritymap.repository;

import com.solidaritymap.model.Center;
import com.solidaritymap.model.CenterType;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class CenterSpecification {

    public static Specification<Center> getSpecifications(String search, CenterType type, Integer urgencyStatus,
            com.solidaritymap.model.CenterStatus status) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                String likeSearch = "%" + search.toLowerCase() + "%";
                Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likeSearch);
                Predicate addressLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("address")), likeSearch);
                predicates.add(criteriaBuilder.or(nameLike, addressLike));
            }

            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (urgencyStatus != null) {
                predicates.add(criteriaBuilder.equal(root.get("urgencyStatus"), urgencyStatus));
            }

            // Default to APPROVED if no specific status is requested?
            // For now let's just allow filtering by status if provided.
            // But we actually need to enforcing APPROVED for public search.
            // Let's rely on the service to pass the status filter.

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
