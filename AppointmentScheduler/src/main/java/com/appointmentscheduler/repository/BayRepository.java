package com.appointmentscheduler.repository;

import com.appointmentscheduler.entity.Bay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BayRepository extends JpaRepository<Bay,Long> {
}
